import server from "/scripts/server.js";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import update from "/scripts/query/update";
import deleteDML from "/scripts/query/delete";

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

    let resData = await readAndSaveFileFromFormdata(req, true);

    // const insert = require("/scripts/query/insert.js");
    const deletePoketmon = [{ name: resData.name }];
    // poketmon 데이터 INSERT
    let deletePrepare = server.db.prepare(deleteDML.delete_poketmon);
    server.sqlite.transaction(deletePoketmon, deletePrepare);

    res.status(200).json({ name: "complete" });
}
