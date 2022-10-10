import server from "../../scripts/server";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, DataSnapshot, query, limitToLast } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-database.js";
// const fb = require("https://www.gstatic.com/firebasejs/8.10.1/firebase.js");
import fconfig from "../../public/temp/config";

export default async function handler(req, res) {
    // console.log(req.query.method);
    let method = req.query.method;
    const app = initializeApp(fconfig);
    const firedb = getDatabase();
    const fireref = ref(firedb, "json/");

    await getFireData(fireref);
    console.log("getFireData is end?");

    if ((method = "toLocal")) {
    } else if ((method = "toServer")) {
    }
    //res.status(200).json({ name: method + " is complete" });
}

async function getFireData(fref) {
    console.log("getFireData start");
    const snapshot = await get(fref);
    console.log("getFireData end : ", snapshot.val());
}
// function getJsonData() {
//   let json = null;
//   var dbTestRef = firebase.database().ref("json/");
//   dbTestRef.on("value", function (data) {
//       //console.log("getJsonData : ", json, data.val());
//       if (data.val()) {
//           json = JSON.parse(data.val()); //saveGlobalData( JSON.parse(data.val()) );
//           console.log("getJsonData 성공했습니다");
//       }
//   });
//   return json;
// }
