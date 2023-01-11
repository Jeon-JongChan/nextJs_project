export { autoComplete, initAutoComplete };
import { syncData } from "/scripts/client/client";
/**
 * 자동완성에 사용될 전역변수 localData가 무조건 필요합니다.
 * 자동완성에 사용되는 함수
 * @param {*} inputNode
 * @param {*} target
 */
async function autoComplete(inputNode, target, localData) {
    localData[target] = await syncData(target, localData[target] || {}, "autoComplete");
    let autoRoot = inputNode.parentNode;
    let autoFrame = autoRoot.querySelector(".autocomplete");
    let inputText = inputNode.value;
    // console.log("autoComplete - ", localData[target], " inputText : ", inputText ? "O" : "X");
    /**
     * 자동완성에 필요한 데이터 추리기
     */
    let addData = [];
    if (inputText) {
        addData = localData[target].data.filter((data) => {
            return data.NAME.indexOf(inputText) > -1;
        });
    } else {
        addData = localData[target].data;
    }

    appendAutoCompleteNode(autoRoot, addData);
}
/**
 * 입력칸에 데이터를 입력할 경우 자동완성 드롭다운 창이 보이게 하는 함수
 * @param {string} id 자동다운 드롭다운을 장착할 input 태그 아이디
 * @param {string} target 자동완성에 사용될 데이터 명
 * @param {object} localData 자동완성에 사용될 데이터 변수
 */
async function initAutoComplete(id, target, localData, caller = "noinfo") {
    let status = null; // 렉시컬을 사용하여 자동완성 함수가 진행중인지 아닌지를 구분
    let focus = false; // 해당 node가 focus되어 있는지 아닌지를 구분
    try {
        localData[target] = await syncData(target, localData[target] || {}, "initAutoComplete");
        /**
         * Node이 없는경우 드롭다운 Node을 만들어준다.
         * 있는 경우 아래 리스트를 삭제하고 새로만든다.
         */
        //document 가 없는 경우는 서버사이드 렌더링이므로 무시
        if (typeof document === "undefined") {
            console.log("initAutoComplete - document is undefined. caller : " + caller);
            return;
        }

        let inputNode = document.querySelector("#" + id);
        let parent = inputNode.parentNode;
        parent = appendAutoCompleteNode(parent, localData[target].data);
        inputNode.setAttribute("data-target", target); // 자동완성 때 어느 데이터를 참조할지 input마다 표기
        /**
         * 입력창에 사용자 반응에 따른 이벤트를 만들어준다.
         * 렉시컬 범위를 이용해 이벤트 중복을 방지한다 ******!!!!
         * keyup 후 0.5초 이후에 종료
         * focus를 잃는경우 바로 종료
         * focus될 경우 자동완성 보여주기
         */
        inputNode.addEventListener(
            "keyup",
            delayCallFunction(async (e) => {
                if (status === "keyup") return;
                status = "keyup";

                let nodeDropFrame = e.target.parentNode.querySelector(".autocomplete");
                toggleAutoCompleteNode(nodeDropFrame);
                await autoComplete(e.target, e.target.dataset.target, localData);
                if (focus) toggleAutoCompleteNode(nodeDropFrame, true);

                status = null;
            }, 500)
        );
        inputNode.addEventListener("focus", async (e) => {
            focus = true;
            if (status === "focus") return;
            status = "focus";

            let nodeDropFrame = e.target.parentNode.querySelector(".autocomplete");
            await autoComplete(e.target, e.target.dataset.target, localData);
            toggleAutoCompleteNode(nodeDropFrame, true);

            status = null;
        });
        /**
         * delay를 적용안할 경우 자동완성 키워드를 클릭해도 이미 hidden상태여서 실행 x
         */
        inputNode.addEventListener(
            "blur",
            delayCallFunction((e) => {
                focus = false;
                if (status === "blur") return;
                status = "blur";

                // console.log("addEventListener blur : ", e.target);
                let nodeDropFrame = e.target.parentNode.querySelector(".autocomplete");
                toggleAutoCompleteNode(nodeDropFrame);

                status = null;
            }, 300)
        );

        return localData;
    } catch (err) {
        console.log("autoComplete error : ", id, target, err);
    }
}

//------------------------------------------ 재사용 가능한 함수들 ------------------------------------------//
/**
 * 함수를 입력받아 지연된 시간 후에 해당 함수를 호출
 * 이미 지연된 함수가 존재할 경우 제거한다.
 * @param {Function} fn
 * @param {int} ms
 */
function delayCallFunction(fn, ms = 1000) {
    // 클로져의 렉시컬 범위를 이용한 문법. 해당 함수 호출이 종료되도 클로져가 남아있는한 함수 내부 변수는 할당해제되지 않는다.
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms);
    };
}
/**
 * 자동완성 드롭다운의 node을 입력받아 상태값에 따라 toggle 시켜준다.
 * @param {document} nodeDropFrame
 * @param {boolean} state false-끄기, true-켜기
 * @returns {document} node
 */
function toggleAutoCompleteNode(nodeDropFrame, state = false) {
    // node 전달이 잘못된 경우 함수 종료
    if (!nodeDropFrame) return null;
    // console.log("toggleAutoCompleteNode : ", nodeDropFrame, state);
    if (state) {
        nodeDropFrame.classList.remove("invisible");
        nodeDropFrame.classList.add("visible");
    } else if (!state) {
        nodeDropFrame.classList.remove("visible");
        nodeDropFrame.classList.add("invisible");
    }

    return nodeDropFrame;
}
/**
 * 드롭다운 node를 만든 후 전달받은 rootNode 추가해주고(리스트를 만들 button 제외) rootNode
 * rootNode 드롭다운node가 존재할경우 초기화만 진행
 * @param {document} rootNode
 * @param {object[]} datalist
 * @returns {document} node
 */
function appendAutoCompleteNode(rootNode, datalist = null) {
    // console.log("appendAutoCompleteNode start : ", rootNode, datalist[0]);
    let dropList = createAutoCompleteNode();
    let dropFrameNode = rootNode.querySelector(".autocomplete");
    if (dropFrameNode) {
        dropFrameNode = deleteAllChildNode(dropFrameNode);
    } else {
        dropFrameNode = dropList[0];
        rootNode.appendChild(dropFrameNode);
    }

    let dropButton = dropList[1];
    for (let idx in datalist) {
        let data = datalist[idx];
        let cpButton = dropButton.cloneNode();
        cpButton.innerText = data.NAME;
        cpButton.addEventListener("click", (e) => {
            try {
                // console.log("자동완성 버튼클릭");
                e.target.parentNode.parentNode.querySelector("input").value = e.target.innerText;
                toggleAutoCompleteNode(e.target.parentNode);
            } catch (e) {
                console.log("자동완성 버튼 작동 실패 : ", e);
            }
        });
        dropFrameNode.appendChild(cpButton);
    }
    return rootNode;
}
/**
 * Dom node를 입력받아 하위 개체를 모두 삭제해준다.
 * @param {object} node
 * @returns {object} node
 */
function deleteAllChildNode(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    return node;
}
/**
 * 자동완성 드롭다운 node 를 만드는 함수(tailwind 사용)
 * node 배열 반환 (frame node, button node)
 * @returns {object[]} dropList
 */
function createAutoCompleteNode() {
    // 자동완성 드롭다운에 필요한 Node 생성
    let dropFrame = document.createElement("div");
    let dropInnerFrame = document.createElement("div");
    let dropButton = document.createElement("button");
    // 자동완성 드롭다운 배치
    // dropInnerFrame.appendChild(dropButton);
    // dropFrame.appendChild(dropInnerFrame);
    // -- Node에 필요한 필수 속성 추가(tailwind 사용중)
    // dropInnerFrame.className = "py-1 max-h-80 overflow-y-scroll";
    // dropFrame.className = "absolute z-20 h-80 overflow-y-scroll py-1 right-0  w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none";
    // dropButton.className = "z-30 text-gray-700 block w-full px-4 py-2 text-left text-sm";
    dropFrame.className = "autocomplete invisible";
    dropButton.className = "autocomplete-btn";
    dropButton.type = "button";
    // dropButton.type = "submit";

    // return dropFrame;
    return [dropFrame, dropButton];
}
