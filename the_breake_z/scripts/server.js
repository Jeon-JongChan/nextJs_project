// 서버에서만 사용되는 js 파일
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

const db = require("better-sqlite3")("temp/macro.db", { verbose: console.log });

const defaultJsonPath = path.join(process.cwd() + "/temp/data.json");
const defaultFilePath = path.join(process.cwd() + "/temp/file");
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
    init: () => {
        console.log("서버시작시 필수요소를 생성합니다");
        try {
            // 필요 폴더 생성
            if (!fs.existsSync(path.join(process.cwd() + "/public/temp"))) fs.mkdirSync(path.join(process.cwd() + "/public/temp"));
            if (!fs.existsSync(path.join(process.cwd() + "/public/temp/images"))) fs.mkdirSync(path.join(process.cwd() + "/public/temp/images"));
        } catch (e) {
            console.log("폴더 생성 에러", e);
        }
        // table 존재여부 확인 및 존재 시 init 함수 종료
        let ret = server.db.prepare("select count(*) cnt from sqlite_master").get();

        if (ret?.cnt === 0) {
            // create table
            try {
                const create = require("/scripts/query/create.js");
                for (let v of Object.values(create)) {
                    server.db.prepare(v).run();
                }
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

            ret = server.db.prepare("select count(*) cnt from personality").get();
            if (ret?.cnt === 0) {
                const insertPersonality = server.db.prepare(insert.insert.personality);
                server.sqlite.transaction(insertData.spec, insertPersonality);
            }
        } catch (e) {
            console.log("init insert 에러.", e.message);
        }
    },
    sqlite: {
        /**
         * @param {*} lists 입력 데이터 형식
         * @param {*} prepare better-sqlite prepare 오브젝트
         */
        transaction: (list, prepare) => {
            // for (let item of list) prepare.run(item);
            const transaction = server.db.transaction((list, prepare) => {
                for (let item of list) prepare.run(item);
            });
            transaction(list, prepare);
        },
        /**
         * @param {*} lists prepare에 입력할 데이터 배열 그룹
         * @param {*} prepareGroup prepare 배열
         */
        transactionAll: (lists, prepareGroup) => {
            const transaction = server.db.transaction((lists, prepareGroup) => {
                prepareGroup.forEach((prepare, idx) => {
                    let list = lists[idx];
                    for (let item of list) prepare.run(item);
                });
            });
            transaction(list, prepare);
        },
    },
    readAndSaveFileFromFormdata: (req, saveLocally, savePath = "/temp/images/") => {
        const form = new formidable.IncomingForm();
        if (saveLocally) {
            form.uploadDir = path.join(process.cwd(), "/public" + savePath);
            form.keepExtensions = true;
        }

        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                // console.log(fields, files, Object.keys(files).length);
                if (Object.keys(files).length) {
                    let fileName = files.image.originalFilename.split(".");

                    let name = "";
                    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식
                    if (fields.name.match(check_kor)) name = btoa(encodeURI(fields.name));
                    else name = fields.name;

                    let newFileName = name + "." + fileName[fileName.length - 1];
                    fs.rename(files.image.filepath, form.uploadDir + newFileName, () => console.log("readFile - Succesfully rename to " + form.uploadDir + "/" + files.image.name));
                    fields.image = savePath + newFileName;
                } else {
                    fields.image = null;
                }
                if (err) reject(err);
                resolve(fields);
            });
        });
    },
};

// server.init();
// function initDB() {
//     server.db.exec("CREATE TABLE IF NOT EXISTS users('ID' varchar(20), PASSWORD VARCHAR(64))");
//     console.log('init db process');
// }
//initDB();
// export default server;
module.exports = server;
// 공용함수 파일 이름은 common.js로 통일
