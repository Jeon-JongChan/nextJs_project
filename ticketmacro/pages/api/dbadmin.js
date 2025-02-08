import server from "/scripts/server";
import deleteq from "/scripts/query/delete";
import insertq from "/scripts/query/insert";
import selectq from "/scripts/query/select";
import createq from "/scripts/query/create";
import {devLog} from "/scripts/common";

export default function handler(req, res) {
    let info = req.query;
    let db = server.db;
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
    } else if (info.query == "drop") {
        for (let v of Object.values(deleteq.drop)) {
            db.prepare(v).run();
        }
    } else if (info.query == "create") {
        for (let v of Object.values(createq)) {
            db.prepare(v).run();
        }
    } else if (info.query == "truncate") {
        let sql_query = `DELETE FROM ${info.table}`;
        db.prepare(sql_query).run();
    } else if (info.query == "query") {
        let sql_query = `${info.table}`;
        db.prepare(sql_query).run();
    }

    devLog("==================================== dbadmin end : ", info);

    res.status(200).json(info);
}
