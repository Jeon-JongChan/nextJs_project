/**
 * 클라이언트에서 저장할 data를 업데이트 해주는 함수.
 * @param {string} url 데이터를 가져올 url
 * @param {string} tableName POST에 보내줄 추출할 데이터명
 * @param {object} data 데이터를 저장할 오브젝트. 오브젝트 형태
 */
async function syncData(tableName, data, caller = "no info") {
    let baseurl = "http://localhost:3000/api/data";
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
    let baseurl = "http://localhost:3000/api/data";
    if (!tableName) return data;

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
            if (resJson?.update_dt) data.status = { cnt: resJson.cnt, lastid: resJson.lastid, update_dt: resJson.update_dt };
            else data.status = { cnt: resJson.cnt, lastid: resJson.lastid };
        }
        isSync = true;
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
