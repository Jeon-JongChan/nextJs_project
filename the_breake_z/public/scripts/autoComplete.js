/**
 * 입력칸에 데이터를 입력할 경우 자동완성 드롭다운 창이 보이게 하는 함수
 * @param {string} id 자동다운 드롭다운을 장착할 input 태그 아이디
 */
async function initAutoComplete(id, localData = {}) {
    try {
        let target = id == "i-local" ? "local" : "spec";
        let apiurl = "http://localhost:3000/api/data";
        let isUpdate = false;

        /*
        현재 저장된 데이터가 있다면 숫자를 비교해 부족하거나 많을 경우 데이터를 교체한다.
        현재 저장된 데이터가 없다면 데이터와 카운터를 저장한다.
        */
        let res = await fetch(apiurl + "?query=count&target=" + target);
        let resJson = await res.json();

        if (localData?.[target]?.cnt) {
            if (localData[target].cnt !== resJson.cnt) localData[target].cnt = resJson.cnt;
            isUpdate = true;
        } else {
            localData[target] = { cnt: resJson.cnt, data: null };
        }

        if (isUpdate || localData[target]?.data === null) {
            let res = await fetch(apiurl, {
                method: "POST",
                body: JSON.stringify({ target: target }),
            });
            let data = await res.json();

            localData[target].data = data;
        }

        /**
         * dom이 없는경우 드롭다운 dom을 만들어준다.
         * 있는 경우 아래 리스트를 삭제하고 새로만든다.
         */
        let inputDom = document.querySelector("#" + id);
        let dom = inputDom.parentNode;
        dom = appendAutoCompleteDom(dom, localData[target].data);

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
 * 자동완성 드롭다운의 dom을 입력받아 상태값에 따라 toggle 시켜준다.
 * @param {document} domDropFrame
 * @param {int} state 0-끄기, 1-켜기
 * @returns {document} dom
 */
function toggleAutoCompleteDom(domDropFrame, state = 0) {
    console.log("자동완성 토글");
    // dom 전달이 잘못된 경우 함수 종료
    if (!domDropFrame) return null;
    if (state === 0) {
        domDropFrame.classList.remove("block");
        domDropFrame.classList.add("hidden");
    } else if (state === 1) {
        domDropFrame.classList.remove("hidden");
        domDropFrame.classList.add("block");
    }

    return domDropFrame;
}
/**
 * 드롭다운 dom을 만든 후 전달받은 dom에 추가해주고(리스트를 만들 button 제외) dom 배열 반환 (dom, button dom)
 * dom에 드롭다운dom이 존재할경우 초기화만 진행
 * @param {document} dom
 * @param {object[]} datalist
 * @returns {document} dom
 */
function appendAutoCompleteDom(dom, datalist = null) {
    // console.log("appendAutoCompleteDom start : ", dom, datalist[0]);
    let dropList = createAutoCompleteDom();
    let domDropFrame = dom.querySelector(".overflow-y-scroll");
    if (domDropFrame) {
        while (domDropFrame.hasChildNodes()) {
            domDropFrame.removeChild(domDropFrame.lastChild);
        }
    } else {
        domDropFrame = dropList[0];
        dom.appendChild(domDropFrame);
    }

    let dropButton = dropList[1];
    for (let idx in datalist) {
        let data = datalist[idx];
        let cpButton = dropButton.cloneNode();
        cpButton.innerText = data.NAME;
        cpButton.addEventListener("click", (e) => {
            toggleAutoCompleteDom(e.target.parentNode);
            e.target.parentNode.parentNode.querySelector("input").value = e.target.innerText;
        });
        domDropFrame.appendChild(cpButton);
    }

    /**
     * 입력창에 사용자 반응에 따른 이벤트를 만들어준다.
     * keyup 후 0.5초 이후에 종료
     * focus를 잃는경우 바로 종료
     */
    let inputDom = dom.querySelector("input");
    inputDom.addEventListener(
        "keyup",
        delayCallFunction((e) => {
            let domDropFrame = e.target.parentNode.querySelector(".overflow-y-scroll");
            toggleAutoCompleteDom(domDropFrame, 1);
        }, 500)
    );
    inputDom.addEventListener("focusout", (e) => {
        let domDropFrame = e.target.parentNode.querySelector(".overflow-y-scroll");
        toggleAutoCompleteDom(domDropFrame);
    });

    return dom;
}
/**
 * 자동완성 드롭다운 dom 을 만드는 함수(tailwind 사용)
 * @returns {object[]} dropList
 */
function createAutoCompleteDom() {
    // 자동완성 드롭다운에 필요한 dom 생성
    let dropFrame = document.createElement("div");
    let dropInnerFrame = document.createElement("div");
    let dropButton = document.createElement("button");
    // 자동완성 드롭다운 배치
    // dropInnerFrame.appendChild(dropButton);
    // dropFrame.appendChild(dropInnerFrame);
    // dom에 필요한 필수 속성 추가(tailwind 사용중)
    dropFrame.className =
        "absolute h-80 overflow-y-scroll py-1 right-0 z-10 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-90 hidden";
    // dropInnerFrame.className = "py-1 max-h-80 overflow-y-scroll";
    dropButton.className = "text-gray-700 block w-full px-4 py-2 text-left text-sm";
    dropButton.type = "submit";

    // return dropFrame;
    return [dropFrame, dropButton];
}
