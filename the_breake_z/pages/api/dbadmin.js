// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import server from "/scripts/server";
import select from "/scripts/query/select";
import create from "/scripts/query/create";
import drop from "/scripts/query/drop";

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
            server.db.prepare(drop.drop_local).run();
            server.db.prepare(drop.drop_spec).run();
            server.db.prepare(drop.drop_image).run();
            server.db.prepare(drop.drop_type).run();
            server.db.prepare(drop.drop_poketmon).run();
            server.db.prepare(drop.drop_poketmon_spec).run();
        } else if (query === "create") {
            server.db.prepare(create.create_table_local).run();
            server.db.prepare(create.create_table_spec).run();
            server.db.prepare(create.create_table_image).run();
            server.db.prepare(create.create_table_type).run();
            server.db.prepare(create.create_table_poketmon).run();
            server.db.prepare(create.create_table_poketmon_spec).run();
        } else if (query === "select") {
            ret = {};
            ret.local = server.db.prepare(select.alldata_local).all();
            ret.spec = server.db.prepare(select.alldata_spec).all();
            ret.poketmon = server.db.prepare(select.alldata_poketmon).all();
            console.log(ret);
        } else if (query === "insert_init") {
            const insert = require("/scripts/query/insert.js");
            const insertData = require("/temp/initData.js");
            ret = server.db.prepare("select count(*) cnt from local").get();
            if (ret?.cnt === 0) {
                const insertLocal = server.db.prepare(insert.insert_local);
                const insertLocalTran = server.db.transaction((lists) => {
                    for (let list of lists) insertLocal.run(list);
                });
                insertLocalTran(insertData.local);
            }

            ret = server.db.prepare("select count(*) cnt from spec").get();
            if (ret?.cnt === 0) {
                const insertSpec = server.db.prepare(insert.insert_spec);
                const insertSpecTran = server.db.transaction((lists) => {
                    for (let list of lists) insertSpec.run(list);
                });
                insertSpecTran(insertData.spec);
            }
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
    res.status(200).json({ ret: ret });
}
