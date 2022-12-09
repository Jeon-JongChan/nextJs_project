import { devLog } from "/scripts/common";
export { submitAdminDelete, submitAdminData, changeTab, updateCheck, findLocalDataByName, syncData, copyToClipBoard, getDomIndex, checkHangulEncode };

let host = process.env.NEXT_PUBLIC_HOST;

/**
 * 관리자 페이지에서 데이터를 서버로 보내주는 함수
 * @param {string} target
 * @param {string[]} inputNameList
 * @param {string} idUniqueTag
 */
async function submitAdminData(target, inputNameList, idUniqueTag, adminSync = null) {
    let inputs = document.querySelectorAll("." + target + "input-frame input");
    let sendData = new FormData();

    for (let input of inputs) {
        for (let inputName of inputNameList) {
            if (input.id === idUniqueTag + inputName) {
                sendData.append(inputName, input.value);
            }
        }
    }

    let baseurl = host + "/api/upload/" + target;
    let res = await fetch(baseurl, {
        method: "POST",
        body: sendData,
    });

    if (adminSync) {
        adminSync.current = target;
    }
}
/**
 * 관리자 페이지에서 삭제요청을 보내는 함수
 * @param {string} target
 * @param {string[]} inputNameList
 * @param {string} idUniqueTag
 */
async function submitAdminDelete(target, idUniqueTag, adminSync = null) {
    let input = document.querySelector("." + target + "input-frame #" + idUniqueTag + "name");

    if (!input) return null;

    let baseurl = host + "/api/delete/" + target;
    let res = await fetch(baseurl, {
        method: "POST",
        body: JSON.stringify({
            name: input.value,
        }),
    });

    if (adminSync) {
        adminSync.current = target;
    }
}
/**
 * 클라이언트에서 저장할 data를 업데이트 해주는 함수.
 * @param {string} url 데이터를 가져올 url
 * @param {string} tableName POST에 보내줄 추출할 데이터명
 * @param {object} data 데이터를 저장할 오브젝트. 오브젝트 형태
 */
async function syncData(tableName, data, caller = "no info") {
    let baseurl = host + "/api/data";
    if (!tableName) {
        devLog("syncLocalData tablename is undefined");
        return data;
    }
    // devLog("syncData : ", tableName, data, caller);
    let isUpdate = await checkSyncData(tableName, data);

    if (isUpdate) {
        // devLog("syncData : " + tableName + " data update - caller : " + caller);
        let res = await fetch(baseurl, {
            method: "POST",
            body: JSON.stringify({ tableName: tableName, query: "localdata" }),
        });
        let json = await res.json();

        data.data = json;
    }
    return data;
}
/**
 * localdata 데이터 동기화 여부를 체크. (개수, 마지막ID, 업데이트시간)
 * @param {*} tableName - 동기화할 테이블 (서버)
 * @param {*} data - 동기화할 데이터 (클라이언트)
 * @param {boolean} update - 동기화 여부를 체크할 값을 체크와 동시에 업데이트를 바로 해줄지 여부
 * @returns
 */
async function checkSyncData(tableName, data, isUpdate = true) {
    let isSync = false;
    let baseurl = host + "/api/data";
    if (!tableName) return data;
    try {
        let resJson = (await (await fetch(baseurl + "?query=status&tableName=" + tableName)).json())[0];
        // devLog("checkSyncData [" + tableName + "] check data : ", resJson);
        if (data?.status) {
            if (updateCheck(data.status, resJson)) {
                if (isUpdate) {
                    data.status.cnt = resJson.cnt;
                    data.status.lastid = resJson.lastid;
                    if (resJson?.update_dt) data.status.update_dt = resJson.update_dt;
                }
                isSync = true;
            }
        } else {
            if (isUpdate) {
                if (resJson?.update_dt) data["status"] = { cnt: resJson.cnt, lastid: resJson.lastid, update_dt: resJson.update_dt };
                else data["status"] = { cnt: resJson.cnt, lastid: resJson.lastid };
            }
            isSync = true;
        }
    } catch (e) {
        devLog("client checkSyncData error. data :", data, e.message);
    }

    return isSync;
}

function updateCheck(data, res, caller = "no info") {
    let isUpdate = false;
    if (data.update_dt) {
        // devLog("data is update : ", data, res, data.cnt !== res.cnt, data.lastid !== res.lastid, data.update_dt !== res.update_dt);
        if (data.cnt !== res.cnt || data.lastid !== res.lastid || data.update_dt !== res.update_dt) isUpdate = true;
    } else {
        // devLog("data.update_dt is null : ", data.cnt, res, data.cnt != res.CNT, data.lastid != res.LASTID);
        if (data.cnt !== res.cnt || data.lastid !== res.lastid) isUpdate = true;
    }
    return isUpdate;
}

function changeTab(query) {
    let oldTab = document.querySelector(".activate-tab");
    let newTab = document.querySelector(query);
    if (oldTab) {
        oldTab.classList.add("hidden");
        oldTab.classList.remove("activate-tab");
    }
    if (newTab) {
        newTab.classList.remove("hidden");
        newTab.classList.add("block");
        newTab.classList.add("activate-tab");
    }
}
function getDomIndex(dom, elem = null) {
    if (!elem) elem = dom.parentNode;
    var idx = null;
    for (var i = 1; i < elem.childNodes.length; i++) {
        if (elem.childNodes[i] === dom) {
            //devLog(elem, elem.childNodes[i],dom,'elemIndex = ', i);
            idx = i;
            break;
        }
    }
    return idx;
}
function copyToClipBoard(query) {
    var node = document.querySelector(query);
    var content = node?.innerText;

    navigator.clipboard
        .writeText(content)
        .then(() => {
            alert("텍스트만 복사되었습니다.");
            devLog("Text copied to clipboard...");
        })
        .catch((err) => {
            devLog("Something went wrong", err);
        });
}
function findLocalDataByName(name, data) {
    let ret = {};
    for (let i = 0; i < data.length; i++) {
        devLog("findLocalDataByName ", data[i].NAME, name, data[i].NAME === name);
        if (data[i].NAME === name) {
            ret = data[i];
            return ret;
        }
    }
    return;
}
const checkHangulEncode = (keyword) => {
    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식

    if (keyword.match(check_kor)) {
        const encodeKeyword = encodeURI(keyword); // 한글 인코딩
        return encodeKeyword;
    } else {
        return keyword;
    }
};
