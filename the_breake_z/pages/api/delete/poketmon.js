import server from "/scripts/server.js";
import deleteDML from "/scripts/query/delete";

export default async function handler(req, res) {
    let body = JSON.parse(req.body);
    let deleteName = body.name;

    // const insert = require("/scripts/query/insert.js");
    const deletePoketmon = [{ name: deleteName }];
    // poketmon 데이터 INSERT
    let deletePrepare = server.db.prepare(deleteDML.delete.poketmon);
    server.sqlite.transaction(deletePoketmon, deletePrepare);

    res.status(200).json({ name: "complete" });
}
// jamx2ee123!