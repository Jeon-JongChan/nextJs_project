// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import server from "/scripts/server";
import select from "/scripts/query/select";
import create from "/scripts/query/create";
import insert from "/scripts/query/insert";
// import tempInitdata from "/temp/initData";
import initdata from "/scripts/query/initdata";
import deleteDDL from "/scripts/query/delete";
import { devLog } from "/scripts/common";

export default function handler(req, res) {
    let ret = null;
    let method = req.method;
    let query = req.query.query;
    if (method !== "GET") {
        res.status(200).json({ status: "Please Call GET Method" });
        return null;
    }
    try {
        // 특수명령 :
        if (query === "boilerplatecreate") {
            server.db.prepare(create.create_table_boilerplate).run();
        } else if (query === "boilerplateinsert") {
            devLog(initdata);
            if (initdata.boilerplate) {
                ret = server.db.prepare("select count(*) cnt from boilerplate").get();
                if (ret?.cnt === 0) {
                    const insertBoilerplate = server.db.prepare(insert.insert.boilerplate);
                    server.sqlite.transaction(initData.boilerplate, insertBoilerplate);
                }
            }
        } else if (query === "boilerplatedrop") {
            server.db.prepare(deleteDDL.drop.boilerplate).run();
        } else if (query === "boilerplateselect") {
            ret = server.db.prepare(select.alldata.boilerplate).all();
            devLog(ret);
        } else if (query === "backupdata") {
            // select.alldata entries 사용
            ret = {};
            for (let [key, value] of Object.entries(select.alldata)) {
                ret[key] = server.db.prepare(value).all();
            }
            devLog("dbadmin backupdata : ", ret);
            server.file.create(JSON.stringify(ret), "/temp/backupdata.json");
        }
    } catch (e) {
        console.log("특수명령 에러", e);
        res.status(500).json({ error: e.message });
        return null;
    }

    // db 전체관리 구문
    try {
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
            ret = server.db.prepare("select count(*) cnt from local").get();
            if (ret?.cnt === 0) {
                try {
                    const tempInitdata = require("/temp/initData");
                    const insertLocal = server.db.prepare(insert.insert.local);
                    server.sqlite.transaction(tempInitdata.local, insertLocal);
                } catch (e) {
                    console.log("initdata 로드 실패");
                }
            }

            ret = server.db.prepare("select count(*) cnt from personality").get();
            if (ret?.cnt === 0) {
                const insertSpec = server.db.prepare(insert.insert.personality);
                server.sqlite.transaction(insertData.spec, insertSpec);
            }
        } else if (query === "delete") {
            server.db.prepare(deleteDDL.delete_poketmon).run();
        } else if (query === "select") {
            ret = {};
            ret.local = server.db.prepare(select.alldata.local).all();
            ret.personality = server.db.prepare(select.alldata.personality).all();
            // ret.spec = server.db.prepare(select.alldata.spec).all();
            // ret.status_spec = server.db.prepare(select.status_spec).all();
            ret.poketmon = server.db.prepare(select.alldata.poketmon).all();
            ret.poketmon_local = server.db.prepare(select.alldata.poketmon_local).all();
            ret.poketmon_spec = server.db.prepare(select.alldata.poketmon_spec).all();
            ret.poketmon_personality = server.db.prepare(select.alldata.poketmon_personality).all();
            ret.poketmon_localdata = server.db.prepare(select.localdata.poketmon).all();
            // ret.image = server.db.prepare(select.alldata.image).all();
            // ret.poketmon_image = server.db.prepare(select.alldata.poketmon_image).all();
            devLog(ret);
        }
    } catch (e) {
        devLog(e.message);
        res.status(500).json({ error: e.message });
        return null;
    }
    res.status(200).json({ ret: ret });
}
