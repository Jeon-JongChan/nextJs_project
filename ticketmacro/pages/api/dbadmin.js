import server from "/scripts/server";
import {devLog} from "/scripts/common";

export default function handler(req, res) {
    let info = req.query;
    let db = server.memdb;
    devLog("==================================== dbadmin query : ", info);
    if (info.query == "select") {
        let sql_query = `select * from ${info.table}`;
        let data = db.prepare(sql_query).all();
        console.log("select query : ", sql_query, data);
        // res.status(200).json(server.memdb.getState());
    } else if (info.query == "tables") {
        let sql_query = `SELECT * FROM sqlite_master`;
        let data = db.prepare(sql_query).all();
        console.log("select query : ", sql_query, data);
    }
    devLog("==================================== dbadmin end : ", info);

    res.status(200).json(info);
}
