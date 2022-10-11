function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
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
function copyToClipBoard(query) {
    var content = document.querySelector(query).innerText;

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
/* 파이어베이스 대체 함수 */

function getDataIdx(objArr, value, key = "name") {
    for (let i = 0; i < objArr.length; i++) {
        if (objArr[i][key] === value) {
            return i;
        }
    }
    return -1;
}
function getJsonData() {
    var dbTestRef = firebase.database().ref("json/");
    dbTestRef.on("value", function (data) {
        //console.log("getJsonData : ", json, data.val());
        if (data.val()) {
            json = JSON.parse(data.val()); //saveGlobalData( JSON.parse(data.val()) );
            console.log("getJsonData 성공했습니다");
        }
    });
}
async function getJsonData() {
    var data = await fetch("/api/data?method=json");
    json = await data.json();
    console.log("getJsonData 성공했습니다");
}
function firebaseSaveFile(path, file) {
    let storeRef = storage.ref();
    let storePath = storeRef.child(path);
    let storeUpload = storePath.put(file);

    console.log("firebase 파일 업로드 : ", storeUpload);
}

function firebaseGetFileUrl(path) {
    var storeRef = storage.ref();
    var item = storeRef.child(path);
    return item.getDownloadURL();
}

function firebaseSaveJson(json) {
    var ret = database
        .ref("json/")
        .set(JSON.stringify(json))
        .then((value) => {
            console.log("data 추가 완료 : ", value);
        })
        .catch((error) => {
            console.log("data 추가 실패 : ", error);
        });
    //console.log("json data를 추가합니다", json, ret);
}
