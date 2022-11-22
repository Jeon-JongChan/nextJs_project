// 해당 프로젝트에서 전역적으로 사용될 변수 및 함수들 기록
/**
 * 서버 호출을 줄이기 위해 로컬에서 가지고 있을 변수데이터
 */
localData = {};
/**
 * global.js -
 * 클라이언트에서 저장할 localdata를 업데이트 해주는 함수.
 * @param {string} url 데이터를 가져올 url
 * @param {string} tableName POST에 보내줄 추출할 데이터명
 * @param {object} localData 데이터를 저장할 오브젝트. 오브젝트 형태 { target : { cnt, data : [{}]}
 */
async function syncLocalData(tableName, localData = {}) {
    //console.log("fetchAutoCompleteData");
    let isUpdate = false;
    let baseurl = "http://localhost:3000/api/data";
    if (!tableName) {
        console.log("syncLocalData tablename is undefined");
        return localData;
    }
    /*
    현재 저장된 데이터가 있다면 숫자를 비교해 부족하거나 많을 경우 데이터를 교체한다.
    현재 저장된 데이터가 없다면 데이터와 카운터를 저장한다.
    */
    isUpdate = await checkSyncLocalData(tableName, localData, true);
    // console.log("global.js - resJson : ", localData);

    if (isUpdate) {
        // console.log("global.js - 데이터를 갱신합니다.");
        let res = await fetch(baseurl, {
            method: "POST",
            body: JSON.stringify({ tableName: tableName, query: "allname" }),
        });
        let data = await res.json();

        localData[tableName].data = data;
    }
    return localData;
}
/**
 * 데이터 동기화 여부를 체크
 * @param {*} tableName - 동기화할 테이블 (서버)
 * @param {*} localData - 동기화할 데이터 (클라이언트)
 * @param {boolean} update - 동기화 여부를 체크할 값을 체크와 동시에 업데이트를 바로 해줄지 여부
 * @returns
 */
async function checkSyncLocalData(tableName, localData = {}, isUpdate = false) {
    let isSync = false;
    let baseurl = "http://localhost:3000/api/data";
    if (!tableName) {
        // console.log("checkSyncLocalData tablename is undefined");
        return localData;
    }
    /*
    현재 저장된 데이터가 있다면 숫자를 비교해 부족하거나 많을 경우 데이터를 교체한다.
    현재 저장된 데이터가 없다면 마지막 데이터ID와 개수를 저장한다.
    */
    let resJson = (await (await fetch(baseurl + "?query=status&tableName=" + tableName)).json())[0];
    // console.log("checkSyncLocalData : ", baseurl + "?query=status&tableName=" + tableName, resJson);
    // console.log("global.js - resJson : ", resJson);
    if (localData?.[tableName]?.cnt) {
        if (localData[tableName].cnt !== resJson.CNT || localData[tableName].lastid !== resJson.LASTID) {
            if (isUpdate) {
                localData[tableName].cnt = resJson.CNT;
                localData[tableName].lastid = resJson.LASTID;
            }
            isSync = true;
        }
    } else {
        if (isUpdate) localData[tableName] = { cnt: resJson.CNT, lastid: resJson.LASTID, data: null };
        isSync = true;
    }

    return isSync;
}
