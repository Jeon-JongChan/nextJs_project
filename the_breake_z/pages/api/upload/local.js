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
        if (!resData.name) {
            res.status(200).json({ status: false, message: "name is null" });
            return null;
        }
        const insertLocalData = [{ name: resData.name }];
        let insertPrepare = server.db.prepare(insert.ignore_local);
        server.sqlite.transaction(insertLocalData, insertPrepare);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
        return null;
    }
    res.status(200).json({ status: true });
}