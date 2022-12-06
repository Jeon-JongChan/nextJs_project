/**
 * 클라이언트에서 저장할 data를 업데이트 해주는 함수.
 * @param {string} url 데이터를 가져올 url
 * @param {string} tableName POST에 보내줄 추출할 데이터명
 * @param {object} data 데이터를 저장할 오브젝트. 오브젝트 형태
 */
let host_url = process.env.NEXT_PUBLIC_HOST;
async function syncData(tableName, data, caller = "no info") {
    let baseurl = host_url + "/api/data";
    if (!tableName) {
        console.log("syncLocalData tablename is undefined");
        return data;
    }
    // console.log("syncData : ", tableName, data, caller);
    let isUpdate = await checkSyncData(tableName, data);

    if (isUpdate) {
        // console.log("syncData : " + tableName + " data update - caller : " + caller);
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
    let baseurl = host_url + "/api/data";
    if (!tableName) return data;
    try {
        let resJson = (await (await fetch(baseurl + "?query=status&tableName=" + tableName)).json())[0];
        // console.log("checkSyncData [" + tableName + "] check data : ", resJson);
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
        console.log("client checkSyncData error. data :", data, e.message);
    }

    return isSync;
}

function updateCheck(data, res, caller = "no info") {
    let isUpdate = false;
    if (data.update_dt) {
        // console.log("data is update : ", data, res, data.cnt !== res.cnt, data.lastid !== res.lastid, data.update_dt !== res.update_dt);
        if (data.cnt !== res.cnt || data.lastid !== res.lastid || data.update_dt !== res.update_dt) isUpdate = true;
    } else {
        // console.log("data.update_dt is null : ", data.cnt, res, data.cnt != res.CNT, data.lastid != res.LASTID);
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
/**
 * setInterval 과 다르게 동기식 진행을 하는 함수를 반환
 * sleep 함수 필요. 렉시컬 응용.
 * @param {*} fn 함수
 * @param {*} ms 반복 시간
 */
function asyncIntervalBak(fn, ms) {
    let state = 1;
    function stop() {
        state = 0;
        console.log("asyncInterval stop state : ", state);
    }
    async function start() {
        console.log("asyncInterval start");
        while (state === 1) {
            await sleep(ms);
            await fn();
            console.log("asyncInterval state : ", state);
        }
        console.log("asyncInterval exit");
    }
    return { start, stop };
}
class asyncInterval {
    constructor(fn, sec) {
        this.startCount = 0;
        this.state = true;
        this.fn = fn;
        this.sec = sec * 1000;
    }
    stop() {
        this.state = false;
        console.log("asyncInterval stop");
    }
    async start(...args) {
        if (this.startCount > 0) {
            console.log("asyncInterval have many jobs - ", this.startCount);
            return;
        }
        console.log("asyncInterval start");
        this.state = true;
        this.startCount += 1;
        while (this.state) {
            this.fn(...args);
            await sleep(this.sec);
        }
        this.startCount = 0;
        console.log("asyncInterval exit");
    }
}
function sleep(ms) {
    let timer;
    return new Promise((resolve) => {
        clearTimeout(timer);
        timer = setTimeout(resolve, ms);
    });
}
function getDomIndex(dom, elem = null) {
    if (!elem) elem = dom.parentNode;
    var idx = null;
    for (var i = 1; i < elem.childNodes.length; i++) {
        if (elem.childNodes[i] === dom) {
            //console.log(elem, elem.childNodes[i],dom,'elemIndex = ', i);
            idx = i;
            break;
        }
    }
    return idx;
}
/**
 * 최소값과 최대값을 받아 사이의 랜덤 정수값 반환 ( 최대값 미포함 )
 * @param {*} min
 * @param {*} max
 * @returns
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값도 미포함, 최솟값만 포함
}

function getRandomValue(values) {
    let idx = getRandomInt(0, values.length);
    return values[idx];
}
function getNameIdx(objArr, name) {
    for (let i = 0; i < objArr.length; i++) {
        if (objArr[i].name === name) {
            return i;
        }
    }
    return -1;
}
function getDataIdx(objArr, value, key = "name") {
    for (let i = 0; i < objArr.length; i++) {
        if (objArr[i][key] === value) {
            return i;
        }
    }
    return -1;
}
function copyToClipBoard(query) {
    var node = document.querySelector(query);
    var content = node?.innerText;

    navigator.clipboard
        .writeText(content)
        .then(() => {
            alert("텍스트만 복사되었습니다.");
            console.log("Text copied to clipboard...");
        })
        .catch((err) => {
            console.log("Something went wrong", err);
        });
}

export { changeTab, copyToClipBoard, getRandomInt, syncData, asyncInterval };
