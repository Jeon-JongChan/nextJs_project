import server from "../../scripts/server";
import select from "../../scripts/query/select";
import { devLog } from "/scripts/common";

export default function handler(req, res) {
    // devLog("call api : ", req.method, req.body);
    let ret = null;
    let method = req.method;

    // nextjs CORS allow for http://localhost:3000
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    // res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    //ret = server.db.prepare("select count(*) cnt from spec").get();
    try {
        let sql = "";
        let data = null;
        if (method === "GET") {
            let tableName = req.query.tableName;
            let query = req.query.query;
            sql = select?.[query]?.[tableName];
        }

        if (method === "POST") {
            let body = JSON.parse(req.body);
            let tableName = body.tableName;
            let query = body.query;
            sql = select?.[query]?.[tableName];
        }
        if (sql !== "undefined" && sql !== "") data = server.db.prepare(sql).all();
        ret = data;

        res.status(200).json(ret);
    } catch (e) {
        devLog(e.message);
        res.status(500).json({ error: e.message });
    }
}
