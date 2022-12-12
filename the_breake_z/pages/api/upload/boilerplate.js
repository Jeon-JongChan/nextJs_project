import server from "/scripts/server.js";
import insert from "/scripts/query/insert";
import update from "/scripts/query/update";
import { devLog } from "/scripts/common";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    let resData = await server.readAndSaveFileFromFormdata(req, true);
    devLog("boilerplate api resData: ", resData);

    try {
        if (!resData.name) {
            res.status(200).json({ status: false, message: "name is null" });
            return null;
        }
        const insertData = [{ name: resData.name, page: resData.page, type: resData.type, text: resData.text }];
        // poketmon 데이터 INSERT
        let insertPrepare = server.db.prepare(insert.upsert.boilerplate);
        server.sqlite.transaction(insertData, insertPrepare);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
        return null;
    }
    res.status(200).json({ status: true });
}
