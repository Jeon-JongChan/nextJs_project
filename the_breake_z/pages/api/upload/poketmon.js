import server from "/scripts/server.js";
import { devLog } from "/scripts/common";
import fs from "fs/promises";
import path from "path";
import insert from "/scripts/query/insert";
import update from "/scripts/query/update";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    let resData = await server.readAndSaveFileFromFormdata(req, true, "/temp/images/");
    console.log("poketmon.js resData: ", resData);
    let insertPrepare;
    try {
        if (resData.name === "") {
            res.status(200).json({ status: false, message: "poketmon name is null" });
            return null;
        }
        // const insert = require("/scripts/query/insert.js");
        const insertPoketmonData = [{ name: resData.name, rare: resData.rare, level_max: resData.levelmax, level_min: resData.levelmin }];
        const insertPoketmonLocalData = [{ poketmon_name: resData.name, local_name: resData.local }];
        const insertPoketmonPesonalityData = [{ poketmon_name: resData.name, personality_name: resData?.personality }];
        let insertPoketmonSpecData = [];
        for (let i = 1; i <= 3; i++) {
            if (resData["spec" + i] !== "") {
                insertPoketmonSpecData.push({ poketmon_name: resData.name, spec_name: resData["spec" + i], priority: i });
            }
        }

        const insertImage = [{ path: resData.image }];
        const insertPoketmonImage = [{ poketmon_name: resData.name, image_path: resData.image }];
        // poketmon 데이터 INSERT
        insertPrepare = server.db.prepare(insert.upsert.poketmon);
        server.sqlite.transaction(insertPoketmonData, insertPrepare);
        // poketmon-local 데이터 INSERT
        if (resData.local !== "") {
            devLog("poketmon-local 데이터 INSERT", insertPoketmonLocalData, insertPrepare);
            insertPrepare = server.db.prepare(insert.replace.poketmon_local);
            server.sqlite.transaction(insertPoketmonLocalData, insertPrepare);
        }
        // poketmon-spec 데이터 INSERT
        if (insertPoketmonSpecData.length > 0) {
            insertPrepare = server.db.prepare(insert.replace.poketmon_spec);
            server.sqlite.transaction(insertPoketmonSpecData, insertPrepare);
        }
        // poketmon-personality 데이터 INSERT
        if (resData.personality !== "") {
            devLog("poketmon-personality 데이터 INSERT", insertPoketmonPesonalityData);
            insertPrepare = server.db.prepare(insert.replace.poketmon_personality);
            server.sqlite.transaction(insertPoketmonPesonalityData, insertPrepare);
        }
        if (resData.image) {
            // image 데이터 INSERT
            insertPrepare = server.db.prepare(insert.ignore.image);
            server.sqlite.transaction(insertImage, insertPrepare);
            // // poketmon-image 데이터 INSERT
            insertPrepare = server.db.prepare(insert.replace.poketmon_image);
            server.sqlite.transaction(insertPoketmonImage, insertPrepare);
        }
        // 정보가 갱신 되면 UPDATE_DT 갱신 (아무것도 변하지 않더라도 복잡도 문제로 그냥 갱신)
        let updatePrepare = server.db.prepare(update.update.poketmon_dt);
        server.sqlite.transaction([{ name: resData.name }], updatePrepare);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
        console.log("poketmon.js error: ", e.message);
        devLog("poketmon.js error query: ", insertPrepare);
        return null;
    }
    res.status(200).json({ status: true });
}
