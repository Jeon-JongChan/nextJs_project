/**
 * 서버 호출을 줄이기 위해 로컬에서 가지고 있을 변수데이터
 */
localData = {};
/**
 * global.js -
 * 클라이언트에서 저장할 localdata를 업데이트 해주는 함수.
 * @param {string} url 데이터를 가져올 url
 * @param {string} target POST에 보내줄 추출할 데이터명
 * @param {object} localData 데이터를 저장할 오브젝트. 오브젝트 형태 { target : { cnt, data : [{}]}
 */
async function updateLocalData(target, localData = {}) {
    console.log("fetchAutoCompleteData");
    let isUpdate = false;
    let baseurl = "http://localhost:3000/api/data";
    /*
    현재 저장된 데이터가 있다면 숫자를 비교해 부족하거나 많을 경우 데이터를 교체한다.
    현재 저장된 데이터가 없다면 데이터와 카운터를 저장한다.
    */
    let resJson = await (await fetch(baseurl + "?query=status&target=" + target)).json();

    if (localData?.[target]?.cnt) {
        if (localData[target].cnt !== resJson.cnt) {
            localData[target].cnt = resJson.cnt;
            isUpdate = true;
        }
    } else {
        localData[target] = { cnt: resJson.cnt, data: null };
        isUpdate = true;
    }

    if (isUpdate) {
        let res = await fetch(baseurl, {
            method: "POST",
            body: JSON.stringify({ target: target }),
        });
        let data = await res.json();

        localData[target].data = data;
    }
    return localData;
}

async function checkSyncLocalData(target, localData = {}) {}
