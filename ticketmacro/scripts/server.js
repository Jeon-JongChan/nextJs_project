const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

const defaultJsonPath = path.join(process.cwd() + "/temp/data.json");
const defaultFilePath = path.join(process.cwd() + "/temp/file");
const defaultbuildMediaPath = path.join(process.cwd(), "/.next/static/media/");

const target_db = process.env.NEXT_PUBLIC_DB || "better-sqlite3";
const target_memdb = process.env.NEXT_PUBLIC_MEMDB || "better-sqlite3";

class Server {
    static db = this.connectDB("file", target_db);
    static memdb = this.connectDB("memory", target_memdb);
    static instance = null; // 싱글톤 패턴

    constructor() {
        if (Server.instance) {
            console.log("-- Server instance already exists");
            return Server.instance;
        }
        // 최초 선언시 모든 setInterval 종료
        clearInterval();

        this.defaultJsonPath = defaultJsonPath;
        this.defaultFilePath = defaultFilePath;
        this.defaultbuildMediaPath = defaultbuildMediaPath;

        if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
        // 인스턴스에서 전역 db 접근할 수 있게
        this.db = Server.db;
        this.memdb = Server.memdb;

        this.init();

        Server.instance = this;
        return this;
    }

    static connectDB(type = "file", target = "better-sqlite3") {
        let db;
        if (type === "file") {
            console.log("-- file db connect : ", target);
            if (target == "lowdb") {
                const low = require("lowdb");
                const FileSync = require("lowdb/adapters/FileSync");
                const adapter = new FileSync(this.defaultJsonPath);
                db = low(adapter);
            } else db = require("better-sqlite3")("temp/macro.db", {verbose: console.log});
        } else if (type === "memory") {
            console.log("-- memory db connect : ", target);
            if (target == "lowdb") {
                const low = require("lowdb");
                const Memory = require("lowdb/adapters/Memory");
                const adapter = new Memory();
                db = low(adapter);
            } else db = require("better-sqlite3")(":memory:", {verbose: console.log});
        }
        return db;
    }

    db_status() {
        return 0;
    }

    sqliteTransaction(list, prepare, db = this.db) {
        const transaction = db.transaction((list, prepare) => {
            for (let item of list) prepare.run(item);
        });
        transaction(list, prepare);
    }

    sqliteTransactionAll(lists, prepareGroup, db = this.db) {
        const transaction = db.transaction((lists, prepareGroup) => {
            prepareGroup.forEach((prepare, idx) => {
                let list = lists[idx];
                for (let item of list) prepare.run(item);
            });
        });
        transaction(list, prepare);
    }

    async readAndSaveFileFromFormdata(req, saveLocally, savePath = "/temp/images/", changeFileName = true) {
        const form = new formidable.IncomingForm();
        if (saveLocally) {
            form.uploadDir = path.join(process.cwd(), "/public" + savePath);
            form.keepExtensions = true;
        }

        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (Object.keys(files).length && changeFileName) {
                    let fileName = files.image.originalFilename.split(".");

                    let name = "";
                    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
                    if (fields.name.match(check_kor)) name = btoa(encodeURI(fields.name));
                    else name = fields.name;

                    let newFileName = name + "." + fileName[fileName.length - 1];
                    fs.rename(files.image.filepath, form.uploadDir + newFileName, () => console.log("readFile - Successfully rename to " + files.image.filepath));
                    fields.image = savePath + newFileName;
                } else {
                    fields.image = null;
                }
                if (err) reject(err);
                resolve(fields);
            });
        });
    }

    async readAndSaveFileFromFormdataTime(req, saveLocally, savePath = "/temp/images/", changeFileName = true) {
        const options = {};
        let imageName = "";
        if (saveLocally) {
            options.uploadDir = path.join(process.cwd(), "/public" + savePath);
            options.keepExtensions = true;
            options.filename = (name, ext, path, form) => {
                imageName = Date.now().toString() + "_" + path.originalFilename;
                return imageName;
            };
        }
        const form = formidable(options);

        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (Object.keys(files).length && changeFileName) {
                    fields.image = savePath + imageName;
                } else {
                    fields.image = null;
                }
                if (err) reject(err);
                resolve(fields);
            });
        });
    }

    init() {
        console.log("-- 서버시작시 필수요소를 생성합니다. : ");
        console.log("-- 서버 설정 정보. NEXT_PUBLIC_DB : ", target_db, ", NEXT_PUBLIC_MEMDB : ", target_memdb);
        try {
            console.log("-- 서버시작 - 기본폴더를 생성합니다.");
            if (!fs.existsSync(this.defaultbuildMediaPath)) fs.mkdirSync(this.defaultbuildMediaPath);
            if (!fs.existsSync(path.join(process.cwd() + "/public/temp"))) fs.mkdirSync(path.join(process.cwd() + "/public/temp"));
            if (!fs.existsSync(path.join(process.cwd() + "/public/temp/images"))) fs.mkdirSync(path.join(process.cwd() + "/public/temp/images"));
        } catch (e) {
            console.log("폴더 생성 에러", e);
        }

        if (target_db === "better-sqlite3") {
            console.log("-- 서버시작 - sqlite db의 기본테이블 생성 프로세스");
            let ret = this.db.prepare("select count(*) cnt from sqlite_master").get();
            console.log("-- better db : ", ret);
            if (ret?.cnt === 0) {
                try {
                    const create = require("./query/create.js");
                    for (let v of Object.values(create)) {
                        this.db.prepare(v).run();
                    }
                } catch (e) {
                    console.log("create query가 존재하지 않습니다.", e);
                }
            }
        }

        if (target_memdb === "better-sqlite3") {
            console.log("-- 서버시작 - sqlite memory db의 기본테이블 생성 프로세스");
            let ret = this.memdb.prepare("select count(*) cnt from sqlite_master").get();
            console.log("-- better memdb : ", ret);
            if (ret?.cnt === 0) {
                try {
                    const create = require("./query/create.js");
                    for (let v of Object.values(create)) {
                        this.memdb.prepare(v).run();
                    }
                } catch (e) {
                    console.log("create query가 존재하지 않습니다.", e);
                }
            }
        }
        console.log("-- 서버시작시 필수요소를 생성했습니다");
    }
}

class ServerFileManager {
    static instance = null; // 싱글톤 패턴

    constructor() {
        if (ServerFileManager.instance) {
            console.log("-- ServerFileManager instance already exists");
            return ServerFileManager.instance;
        }

        this.defaultJsonPath = defaultJsonPath;
        this.defaultFilePath = defaultFilePath;
        this.defaultbuildMediaPath = defaultbuildMediaPath;

        if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
        // 인스턴스에서 전역 db 접근할 수 있게

        ServerFileManager.instance = this;
        return this;
    }

    fileAppend(data, filePath = this.defaultFilePath) {
        this.init();
        fs.appendFileSync("." + filePath, data, (err) => {
            if (err) console.log("err : ", err);
        });
    }

    fileCreate(data, filePath = this.defaultFilePath) {
        fs.writeFile("." + filePath, data, (err) => {
            if (err) console.log("err : ", err);
        });
    }

    jsonRead(key, id = "root") {
        if (!fs.existsSync(this.defaultJsonPath)) {
            return null;
        } else {
            let data = JSON.parse(fs.readFileSync(this.defaultJsonPath));
            if (!data[id]) {
                console.log("readJson > 해당 id로 저장된 데이터가 없습니다.");
                return null;
            }
            if (key) return data[id][key];
        }
        return null;
    }

    jsonSave(json, id = "root") {
        let data;
        if (!fs.existsSync(this.defaultJsonPath)) {
            if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
            fs.writeFile(this.defaultJsonPath, "", (err) => {
                if (err) console.log("err : ", err);
            });
            data = {};
        } else data = JSON.parse(fs.readFileSync(this.defaultJsonPath));
        if (!data[id]) data[id] = {};
        console.log("saveJson", json, Object.keys(json));
        for (var v of Object.keys(json)) {
            console.log(id, Object.keys(json), v, json[v], data[id]);
            data[id][v] = json[v];
        }
        fs.writeFileSync(this.defaultJsonPath, JSON.stringify(data));
    }

    jsonRemove(key, id = "root") {
        if (!key) {
            console.log("removeJson > key is undefined");
            return null;
        }
        let json = this.jsonRead();
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
        fs.writeFileSync(this.defaultJsonPath, JSON.stringify(data));
    }
}
const server = new Server();
export default server;
export {ServerFileManager};
