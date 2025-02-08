// 한번만 로드하도록 처리
const fs = require("fs");
//  mv : require("mv"),
const formidable = require("formidable");
const path = require("path");
// db 생성 부분 (lowdb, better-sqlite3)
const target_db = process.env.NEXT_PUBLIC_DB || "better-sqlite3";
const target_memdb = process.env.NEXT_PUBLIC_MEMDB || "better-sqlite3";
const db = connectDB("file", target_db);
const memdb = connectDB("memory", target_memdb);
const config = {
    fs: fs,
    formidable: formidable,
    path: path,
    defaultJsonPath: path.join(process.cwd() + "/temp/data.json"),
    defaultFilePath: path.join(process.cwd() + "/temp/file"),
    defaultbuildMediaPath: path.join(process.cwd(), "/.next/static/media/"),
    target_db: target_db,
    target_memdb: target_memdb,
    db: db,
    memdb: memdb,
    init: 0,
    //const db = new sqlite("temp/macro.db", { verbose: console.log });
};
function connectDB(type = "file", target = "better-sqlite3") {
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
            //db.defaults({sse: [{id: "test", message: "text"}]}).write();
        } else db = require("better-sqlite3")(":memory:", {verbose: console.log});
    }
    return db;
}
export default config;
/*
const fs = require("fs");
// const mv = require("mv");
const formidable = require("formidable");
const path = require("path");

const defaultJsonPath = path.join(process.cwd() + "/temp/data.json");
const defaultFilePath = path.join(process.cwd() + "/temp/file");
const defaultbuildMediaPath = path.join(process.cwd(), "/.next/static/media/");

if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
// db 생성 부분 (lowdb, better-sqlite3)
let target_db = process.env.NEXT_PUBLIC_DB || "better-sqlite3";
let target_memdb = process.env.NEXT_PUBLIC_MEMDB || "better-sqlite3";

const db = connectDB("file", target_db);
const memdb = connectDB("memory", target_memdb);
//const db = new sqlite("temp/macro.db", { verbose: console.log });

function connectDB(type = "file", target = "better-sqlite3") {
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
            //db.defaults({sse: [{id: "test", message: "text"}]}).write();
        } else db = require("better-sqlite3")(":memory:", {verbose: console.log});
    }
    return db;
}
*/
