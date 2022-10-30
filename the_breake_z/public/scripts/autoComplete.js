async function autoComplete(input, target) {
    /**
     * initAutoComplete 에서 무조건 전역 localData를 선언했어야 함으로 따로 체크 x
     */
    /**
     * 데이터 동기화 체크는 updateLocalData에서 해주므로 무조건 한번 실행
     */
    localData = await updateLocalData(target, localData);

    let autoRoot = input.parentNode;
    let autoFrame = autoRoot.querySelector(".autocomplete");
    let inputText = input.value;
}
/**
 * 입력칸에 데이터를 입력할 경우 자동완성 드롭다운 창이 보이게 하는 함수
 * @param {string} id 자동다운 드롭다운을 장착할 input 태그 아이디
 * @param {string} target 자동완성에 사용될 데이터 명
 * @param {object} localData 자동완성에 사용될 데이터 변수
 */
async function initAutoComplete(id, target, localData = {}) {
    try {
        localData = await updateLocalData(target, localData);
        console.log(localData);
        /**
         * Node이 없는경우 드롭다운 Node을 만들어준다.
         * 있는 경우 아래 리스트를 삭제하고 새로만든다.
         */
        let inputNode = document.querySelector("#" + id);
        let node = inputNode.parentNode;
        node = appendAutoCompleteNode(node, localData[target].data);

        /**
         * 입력창에 사용자 반응에 따른 이벤트를 만들어준다.
         * keyup 후 0.5초 이후에 종료
         * focus를 잃는경우 바로 종료
         * focus될 경우 자동완성 보여주기
         */
        inputNode.addEventListener(
            "keyup",
            delayCallFunction((e) => {
                console.log("delayCallFunction", e.target.value);
                let nodeDropFrame = e.target.parentNode.querySelector(".autocomplete");
                toggleAutoCompleteNode(nodeDropFrame, 1);
            }, 500)
        );
        inputNode.addEventListener("focus", (e) => {
            let nodeDropFrame = e.target.parentNode.querySelector(".autocomplete");
            toggleAutoCompleteNode(nodeDropFrame, 1);
        });
        /**
         * delay를 적용안할 경우 자동완성 키워드를 클릭해도 이미 hidden상태여서 실행 x
         */
        inputNode.addEventListener(
            "blur",
            delayCallFunction((e) => {
                let nodeDropFrame = e.target.parentNode.querySelector(".autocomplete");
                toggleAutoCompleteNode(nodeDropFrame);
            }, 200)
        );

        return localData;
    } catch (err) {
        console.log("autoComplete error : ", err);
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
 * @param {int} state 0-끄기, 1-켜기
 * @returns {document} node
 */
function toggleAutoCompleteNode(nodeDropFrame, state = 0) {
    // node 전달이 잘못된 경우 함수 종료
    if (!nodeDropFrame) return null;
    if (state === 0) {
        nodeDropFrame.classList.remove("visible");
        nodeDropFrame.classList.add("invisible");
    } else if (state === 1) {
        nodeDropFrame.classList.remove("invisible");
        nodeDropFrame.classList.add("visible");
    }

    return nodeDropFrame;
}
/**
 * 드롭다운 node를 만든 후 전달받은 node에 추가해주고(리스트를 만들 button 제외) node 배열 반환 (node, button node)
 * node에 드롭다운node가 존재할경우 초기화만 진행
 * @param {document} node
 * @param {object[]} datalist
 * @returns {document} node
 */
function appendAutoCompleteNode(node, datalist = null) {
    // console.log("appendAutoCompleteNode start : ", node, datalist[0]);
    let dropList = createAutoCompleteNode();
    let nodeDropFrame = node.querySelector(".autocomplete");
    if (nodeDropFrame) {
        nodeDropFrame = deleteAllChildNode(node);
    } else {
        nodeDropFrame = dropList[0];
        node.appendChild(nodeDropFrame);
    }

    let dropButton = dropList[1];
    for (let idx in datalist) {
        let data = datalist[idx];
        let cpButton = dropButton.cloneNode();
        cpButton.innerText = data.NAME;
        cpButton.addEventListener("click", (e) => {
            e.stopPropagation();
            try {
                console.log("자동완성 버튼클릭");
                e.target.parentNode.parentNode.querySelector("input").value = e.target.innerText;
                toggleAutoCompleteNode(nodeDropFrame);
            } catch (e) {
                console.log("자동완성 버튼 작동 실패 : ", e);
            }
        });
        nodeDropFrame.appendChild(cpButton);
    }
    return node;
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
    // dropFrame.className = "absolute h-80 overflow-y-scroll py-1 right-0 z-50 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-90 hidden";
    // dropButton.className = "text-gray-700 block w-full px-4 py-2 text-left text-sm";
    dropFrame.className = "autocomplete invisible";
    dropButton.className = "autocomplete-btn";
    // dropButton.type = "submit";

    // return dropFrame;
    return [dropFrame, dropButton];
}
