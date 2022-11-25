// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import server from "/scripts/server";
import select from "/scripts/query/select";
import create from "/scripts/query/create";
import insert from "/scripts/query/insert";
import deleteDDL from "/scripts/query/delete";

export default function handler(req, res) {
    let ret = null;
    let method = req.method;

    if (method !== "GET") {
        res.status(200).json({ status: "Please Call GET Method" });
        return null;
    }

    //ret = server.db.prepare("select count(*) cnt from spec").get();
    try {
        let query = req.query.query;
        if (query === "drop") {
            for (let v of Object.values(deleteDDL.drop)) {
                server.db.prepare(v).run();
            }
        } else if (query === "truncate") {
            for (let v of Object.values(deleteDDL.truncate)) {
                server.db.prepare(v).run();
            }
        } else if (query === "create") {
            for (let v of Object.values(create)) {
                server.db.prepare(v).run();
            }
        } else if (query === "insert_init") {
            const insertData = require("/temp/initData.js");
            ret = server.db.prepare("select count(*) cnt from local").get();
            if (ret?.cnt === 0) {
                const insertLocal = server.db.prepare(insert.insert.local);
                server.sqlite.transaction(insertData.local, insertLocal);
            }

            ret = server.db.prepare("select count(*) cnt from spec").get();
            if (ret?.cnt === 0) {
                const insertSpec = server.db.prepare(insert.insert.spec);
                server.sqlite.transaction(insertData.spec, insertSpec);
            }
        } else if (query === "delete") {
            server.db.prepare(deleteDDL.delete_poketmon).run();
        } else if (query === "select") {
            ret = {};
            // ret.local = server.db.prepare(select.alldata_local).all();
            ret.spec = server.db.prepare(select.alldata_spec).all();
            ret.status_spec = server.db.prepare(select.status_spec).all();
            ret.poketmon = server.db.prepare(select.alldata_poketmon).all();
            ret.poketmon_local = server.db.prepare(select.alldata_poketmon_local).all();
            ret.poketmon_spec = server.db.prepare(select.alldata_poketmon_spec).all();
            ret.image = server.db.prepare(select.alldata_image).all();
            ret.poketmon_image = server.db.prepare(select.alldata_poketmon_image).all();
            console.log(ret);
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
    res.status(200).json({ ret: ret });
}
