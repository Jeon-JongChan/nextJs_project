// 서버에서만 사용되는 js 파일
const fs = require("fs");
if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

const db = require("better-sqlite3")("temp/macro.db", { verbose: console.log });

const defaultJsonPath = "./temp/data.json";
const defaultFilePath = "./temp/file";
//const db = new sqlite("temp/macro.db", { verbose: console.log });

const server = {
    file: {
        save: (data, filePath = defaultFilePath) => {
            server.init();
            fs.appendFileSync(filePath, data, (err) => {
                if (err) console.log("err : ", err);
            });
        },
    },
    json: {
        read: (key, id = "root") => {
            if (!fs.existsSync(defaultJsonPath)) {
                return null;
            } else {
                data = JSON.parse(fs.readFileSync(defaultJsonPath));
                if (!data[id]) {
                    console.log("readJson > 해당 id로 저장된 데이터가 없습니다.");
                    return null;
                }
                if (key) return data[id][key];
            }
            return null;
        },
        save: (json, id = "root") => {
            let data;
            if (!fs.existsSync(defaultJsonPath)) {
                if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
                fs.writeFile(defaultJsonPath, "", (err) => {
                    if (err) console.log("err : ", err);
                });
                data = {};
            } else data = JSON.parse(fs.readFileSync(defaultJsonPath));
            if (!data[id]) data[id] = {};
            console.log("saveJson", json, Object.keys(json));
            for (var v of Object.keys(json)) {
                console.log(id, Object.keys(json), v, json[v], data[id]);
                data[id][v] = json[v];
            }
            //console.log("data 읽음 : ",data, "json data : ", json);
            fs.writeFileSync(defaultJsonPath, JSON.stringify(data));
        },
        remove: (key, id = "root") => {
            if (!key) {
                console.log("removeJson > key is undefined");
                return null;
            }
            let json = server.readJson();
            let data = {};
            if (!json[id]) {
                console.log("removeJson > 해당 id로 저장된 데이터가 없습니다.");
                return null;
            }
            for (var v of Object.keys(json[id])) {
                if (v == key) {
                    console.log(key + " is delete");
                    continue;
                }
                data[id][v] = json[id][v];
            }
            fs.writeFileSync(defaultJsonPath, JSON.stringify(data));
        },
    },
    db: db,
    dbinit: () => {
        // table 존재여부 확인 및 존재 시 init 함수 종료
        let ret = server.db.prepare("select count(*) cnt from sqlite_master").get();

        if (ret?.cnt === 0) {
            // create table
            try {
                const create = require("/scripts/query/create.js");
                server.db.prepare(create.create_table_local).run();
                server.db.prepare(create.create_table_spec).run();
                server.db.prepare(create.create_table_image).run();
                server.db.prepare(create.create_table_type).run();
                server.db.prepare(create.create_table_poketmon).run();
                server.db.prepare(create.create_table_poketmon_spec).run();
            } catch (e) {
                console.log("create query가 존재하지 않습니다.", e);
            }
        }

        // insert init data
        try {
            const insert = require("/scripts/query/insert.js");
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
        } catch (e) {
            console.log("init insert 에러.", e);
        }
    },
    sqlite: {
        /**
         * @param {*} lists 입력 데이터 형식
         * @param {*} prepare better-sqlite prepare 오브젝트
         */
        transaction: (lists, prepare) => {
            for (let list of lists) prepare.run(list);
        },
    },
};

server.dbinit();
// function initDB() {
//     server.db.exec("CREATE TABLE IF NOT EXISTS users('ID' varchar(20), PASSWORD VARCHAR(64))");
//     console.log('init db process');
// }
//initDB();
export default server;
