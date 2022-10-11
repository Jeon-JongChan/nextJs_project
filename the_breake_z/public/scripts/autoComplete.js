/**
 * 입력칸에 데이터를 입력할 경우 자동완성 드롭다운 창이 보이게 하는 함수
 * @param {string} id
 */
async function autoComplete(id, localData = {}) {
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
        let dom = document.querySelector("#" + id).parentNode;
        dom = appendAutoCompleteDom(dom, localData[target].data);

        return localData;
    } catch (err) {
        console.log("autoComplete error : ", err);
    }
}
/**
 * 드롭다운 dom을 만든 후 특정 dom에 추가해주고(리스트를 만들 button 제외) dom 배열 반환 (dom, button dom)
 * dom에 드롭다운dom이 존재할경우 초기화만 진행
 * @param {document} dom
 * @param {object[]} datalist
 * @returns {document} dom
 */
function appendAutoCompleteDom(dom, datalist = null) {
    // console.log("appendAutoCompleteDom start : ", dom, datalist[0]);
    let dropList = createAutoCompleteDom();
    let domDropFrame = dom.querySelector(".absolute");
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
        domDropFrame.appendChild(cpButton);
    }
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
    dropFrame.className = "relative h-80 overflow-y-scroll py-1 right-0 z-10 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-90";
    // dropInnerFrame.className = "py-1 max-h-80 overflow-y-scroll";
    dropButton.className = "text-gray-700 block w-full px-4 py-2 text-left text-sm";
    dropButton.type = "submit";

    // return dropFrame;
    return [dropFrame, dropButton];
}
