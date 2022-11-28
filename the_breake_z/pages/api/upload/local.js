import server from "/scripts/server.js";
import insert from "/scripts/query/insert";
import update from "/scripts/query/update";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    console.log("local api");
    let resData = await server.readAndSaveFileFromFormdata(req, true);
    console.log(resData);
    try {
        // const insert = require("/scripts/query/insert.js");
        const insertPoketmonData = [{ name: resData.name, rare: resData.rare, level_max: resData.levelmax, level_min: resData.levelmin }];
        const insertPoketmonLocalData = [{ poketmon_name: resData.name, local_name: resData.local }];
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
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
    res.status(200).json({ status: true });
}
