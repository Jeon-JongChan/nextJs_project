/* 파이어베이스 대체 함수 */
/*
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
*/
