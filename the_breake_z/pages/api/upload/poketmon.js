import server from "/scripts/server.js";
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
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/temp/images"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/temp/images"));
    }

    let resData = await server.readAndSaveFileFromFormdata(req, true);
    try {
        if (!resData.name) {
            res.status(200).json({ status: false, message: "poketmon name is null" });
            return null;
        }
        // const insert = require("/scripts/query/insert.js");
        const insertPoketmonData = [{ name: resData.name, rare: resData.rare, level_max: resData.levelmax, level_min: resData.levelmin }];
        const insertPoketmonLocalData = [{ poketmon_name: resData.name, local_name: resData.local }];
        const insertPoketmonPesonalityData = [{ poketmon_name: resData.name, personality_name: resData?.personality }];
        const insertPoketmonSpecData = [
            { poketmon_name: resData.name, spec_name: resData.spec1, priority: 1 },
            { poketmon_name: resData.name, spec_name: resData.spec2, priority: 2 },
            { poketmon_name: resData.name, spec_name: resData.spec3, priority: 3 },
        ];
        const insertImage = [{ path: resData.image }];
        const insertPoketmonImage = [{ poketmon_name: resData.name, image_path: resData.image }];
        // poketmon 데이터 INSERT
        let insertPrepare = server.db.prepare(insert.upsert_poketmon);
        server.sqlite.transaction(insertPoketmonData, insertPrepare);
        // poketmon-local 데이터 INSERT
        insertPrepare = server.db.prepare(insert.replace_poketmon_local);
        server.sqlite.transaction(insertPoketmonLocalData, insertPrepare);
        // poketmon-spec 데이터 INSERT
        insertPrepare = server.db.prepare(insert.replace_poketmon_spec);
        server.sqlite.transaction(insertPoketmonSpecData, insertPrepare);
        // poketmon-personality 데이터 INSERT
        insertPrepare = server.db.prepare(insert.replace_poketmon_personality);
        server.sqlite.transaction(insertPoketmonPesonalityData, insertPrepare);
        if (resData.image) {
            // image 데이터 INSERT
            insertPrepare = server.db.prepare(insert.ignore_image);
            server.sqlite.transaction(insertImage, insertPrepare);
            // // poketmon-image 데이터 INSERT
            insertPrepare = server.db.prepare(insert.replace_poketmon_image);
            server.sqlite.transaction(insertPoketmonImage, insertPrepare);
        }
        // 정보가 갱신 되면 UPDATE_DT 갱신 (아무것도 변하지 않더라도 복잡도 문제로 그냥 갱신)
        let updatePrepare = server.db.prepare(update.update_poketmon_dt);
        server.sqlite.transaction([{ name: resData.name }], updatePrepare);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
        return null;
    }
    res.status(200).json({ status: true });
}
