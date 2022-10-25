import server from "../../scripts/server";
import select from "../../scripts/query/select";

export default function handler(req, res) {
    // console.log("call api : ", req.method, req.body);
    let ret = null;
    let method = req.method;

    //ret = server.db.prepare("select count(*) cnt from spec").get();
    try {
        let sql = "";
        let data = null;
        if (method === "GET") {
            let target = req.query.target;
            let query = req.query.query;
            sql = select?.[query + "_" + target];
            if (sql !== "undefined" && sql !== "") data = server.db.prepare(sql).get();
            ret = data;
        }
        if (method === "POST") {
            let body = JSON.parse(req.body);
            if (body?.target === "spec") sql = select.alldata_spec;
            else if (body?.target === "local") sql = select.alldata_local;
            else if (body?.target === "poketmon") sql = select.alldata_poketmon;

            if (sql !== "") data = server.db.prepare(sql).all();
            ret = data;
        }

        res.status(200).json(ret);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
}
