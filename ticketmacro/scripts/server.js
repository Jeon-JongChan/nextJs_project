// 서버에서만 사용되는 js 파일
const fs = require("fs");
// const mv = require("mv");
const formidable = require("formidable");
const path = require("path");

const defaultJsonPath = path.join(process.cwd() + "/temp/data.json");
const defaultFilePath = path.join(process.cwd() + "/temp/file");
const defaultbuildMediaPath = path.join(process.cwd(), "/.next/static/media/");

if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
// db 생성 부분 (lowdb, better-sqlite3)
let target_db = process.env.NEXT_PUBLIC_DB || "lowdb";
let target_memdb = process.env.NEXT_PUBLIC_MEMDB || "lowdb";

const db = connectDB("file", target_db);
const memdb = connectDB("memory", target_memdb);
//const db = new sqlite("temp/macro.db", { verbose: console.log });

function connectDB(type = "file", target = "lowdb") {
    let db;
    if (type === "file") {
        console.log("file db connect : ", target);
        if (target == "lowdb") {
            const low = require("lowdb");
            const FileSync = require("lowdb/adapters/FileSync");
            const adapter = new FileSync(defaultJsonPath);
            db = low(adapter);
        } else db = require("better-sqlite3")("temp/macro.db", {verbose: console.log});
    } else if (type === "memory") {
        console.log("memory db connect : ", target);
        if (target == "lowdb") {
            const low = require("lowdb");
            const Memory = require("lowdb/adapters/Memory");
            const adapter = new Memory();
            db = low(adapter);
            db.defaults({sse: [{id: "test", message: "text"}]}).write();
        } else db = require("better-sqlite3")(":memory:", {verbose: console.log});
    }
    return db;
}

const server = {
    db: db,
    memdb: memdb,
    db_status: () => {
        return 0;
    },
    sqlite: {
        /**
         * @param {*} lists 입력 데이터 형식
         * @param {*} prepare better-sqlite prepare 오브젝트
         */
        transaction: (list, prepare, db = server.db) => {
            // for (let item of list) prepare.run(item);
            const transaction = db.transaction((list, prepare) => {
                for (let item of list) prepare.run(item);
            });
            transaction(list, prepare);
        },
        /**
         * @param {*} lists prepare에 입력할 데이터 배열 그룹
         * @param {*} prepareGroup prepare 배열
         */
        transactionAll: (lists, prepareGroup, db = server.db) => {
            const transaction = db.transaction((lists, prepareGroup) => {
                prepareGroup.forEach((prepare, idx) => {
                    let list = lists[idx];
                    for (let item of list) prepare.run(item);
                });
            });
            transaction(list, prepare);
        },
    },
    memapi: {
        get: (query, condition = null) => {
            if (target_memdb === "lowdb") {
                if (!condition) return server.memdb.get(query).value();
                else if (condition) return server.memdb.get(query).find(condition).value();
            } else if (target_memdb === "better-sqlite3") {
                return server.memdb.prepare(query).all();
            }
        },
        insert: (query, insertData) => {
            if (target_memdb === "lowdb") {
                server.memdb.get(query).push(insertData).write();
            } else if (target_memdb === "better-sqlite3") {
                let prepare = server.memdb.prepare(query);
                server.sqlite.transaction(insertData, prepare, server.memdb);
            }
        },
        delete: (query, condition) => {
            if (target_memdb === "lowdb") {
                // server.memdb.get('sse').find({id: id}).head().unset("[0]").write();
                server.memdb.get(query).remove(condition).write();
            } else if (target_memdb === "better-sqlite3") {
                let prepare = server.memdb.prepare(query);
                server.sqlite.transaction(condition, prepare, server.memdb);
            }
        },
        first: (query) => {
            if (target_memdb === "lowdb") {
                console.log(`first server.memdb.get(${query}).head()`, server.memdb.get(query).head().value());
                return server.memdb.get(query).head().value();
            } else if (target_memdb === "better-sqlite3") {
                return server.memdb.prepare(query).get();
            }
        },
        last: (query) => {
            if (target_memdb === "lowdb") {
                return server.memdb.get(query).last().value();
            } else if (target_memdb === "better-sqlite3") {
                return server.memdb.prepare(query).all().pop();
            }
        },
        firstDelete: (query) => {
            if (target_memdb === "lowdb") {
                server.memdb.get(query).shift();
            }
        },
        lastDelete: (query) => {
            if (target_memdb === "lowdb") {
                server.memdb.get(query).last().remove().write();
            }
        },
    },
    readAndSaveFileFromFormdata: (req, saveLocally, savePath = "/temp/images/", changeFileName = true) => {
        const form = new formidable.IncomingForm();
        if (saveLocally) {
            form.uploadDir = path.join(process.cwd(), "/public" + savePath);
            form.keepExtensions = true;
        }

        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                // console.log(fields, files, Object.keys(files).length);
                if (Object.keys(files).length && changeFileName) {
                    let fileName = files.image.originalFilename.split(".");

                    let name = "";
                    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식
                    if (fields.name.match(check_kor)) name = btoa(encodeURI(fields.name));
                    else name = fields.name;

                    let newFileName = name + "." + fileName[fileName.length - 1];
                    // console.log("readAndSaveFileFromFormdata image filepath : ", files.image.filepath, files);
                    fs.rename(files.image.filepath, form.uploadDir + newFileName, () => console.log("readFile - Succesfully rename to " + files.image.filepath));
                    // build+start 일경우 public에 있는 파일을 못읽어오기 때문에 build의 미디어폴더에 저장
                    // fs.copyFile(form.uploadDir + newFileName, defaultbuildMediaPath + newFileName);
                    // mv(files.image.filepath, form.uploadDir + newFileName, () => console.log("readFile - Succesfully rename to " + files.image.filepath));
                    fields.image = savePath + newFileName;
                } else {
                    fields.image = null;
                }
                if (err) reject(err);
                resolve(fields);
            });
        });
    },
    readAndSaveFileFromFormdataTime: (req, saveLocally, savePath = "/temp/images/", changeFileName = true) => {
        const options = {};
        let imageName = "";
        if (saveLocally) {
            options.uploadDir = path.join(process.cwd(), "/public" + savePath);
            options.keepExtensions = true;
            options.filename = (name, ext, path, form) => {
                // timedata로 이름변경
                imageName = Date.now().toString() + "_" + path.originalFilename;

                //고유값으로
                /*
                const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식
                if (name.match(check_kor)) imageName = btoa(encodeURI(Date.now().toString() + name));
                else imageName = name;

                imageName = imageName + ext;
                console.log("readAndSaveFileFromFormdata image filepath 1 : ", imageName);
                */
                return imageName;
            };
        }
        const form = formidable(options);

        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                // console.log(fields, files, Object.keys(files).length);
                if (Object.keys(files).length && changeFileName) {
                    fields.image = savePath + imageName;
                } else {
                    fields.image = null;
                }
                if (err) reject(err);
                resolve(fields);
            });
        });
    },
    file: {
        append: (data, filePath = defaultFilePath) => {
            server.init();
            fs.appendFileSync("." + filePath, data, (err) => {
                if (err) console.log("err : ", err);
            });
        },
        create: (data, filePath = defaultFilePath) => {
            fs.writeFile("." + filePath, data, (err) => {
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
};

function init() {
    console.log("서버시작시 필수요소를 생성합니다");
    try {
        // 필요 폴더 생성
        if (!fs.existsSync(defaultbuildMediaPath)) fs.mkdirSync(defaultbuildMediaPath);
        if (!fs.existsSync(path.join(process.cwd() + "/public/temp"))) fs.mkdirSync(path.join(process.cwd() + "/public/temp"));
        if (!fs.existsSync(path.join(process.cwd() + "/public/temp/images"))) fs.mkdirSync(path.join(process.cwd() + "/public/temp/images"));
    } catch (e) {
        console.log("폴더 생성 에러", e);
    }
    // table 존재여부 확인 및 존재 시 init 함수 종료
    let targetdb = server.memdb;

    if (target_db === "better_sqlite3" || target_memdb === "better_sqlite3") {
        let ret = targetdb.prepare("select count(*) cnt from sqlite_master").get();

        if (ret?.cnt === 0) {
            // create table
            try {
                const create = require("./query/create.js");
                for (let v of Object.values(create)) {
                    targetdb.prepare(v).run();
                }
            } catch (e) {
                console.log("create query가 존재하지 않습니다.", e);
            }
        }
    }
    console.log("서버시작시 필수요소를 생성했습니다");
}
init();
export default server;
export {init};
// 공용함수 파일 이름은 common.js로 통일
