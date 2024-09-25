import {promises as fs} from "fs";
import path from "path";
import jsondb from "./jsondb.js";
import Sqlite from "./sqlite3-adapter.js";
import SqliteQuery from "./sqlite3-query.js";
import {devLog} from "./common.js";

export {saveFiles, saveData, deleteData, getData, getDataKey};

const server = process.env.NEXT_SERVER || "";
const sqlite = new Sqlite(); // 기본 dbPath 사용, verbose 출력 활성화

async function saveFiles(files, uploadDir = undefined) {
  try {
    if (!uploadDir) {
      uploadDir = path.join(process.cwd(), "public/temp", "uploads");
      if (server == "vercel") uploadDir = path.join("public/temp", "uploads"); // vercel에서 process.cwd()는 /var/task로 인식해버림
    }
    console.info("server.js saveFiles uploadDir : ", uploadDir);
    await fs.mkdir(uploadDir, {recursive: true});

    const fileUploadPromises = files.map(async (file) => {
      const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
      const savename = path.basename(filePath);

      // 파일 정보 (lastModified, size) 가져오기
      const {lastModified, size, name} = file;

      // DB에서 중복 파일 조회
      const isDuplicate = checkDuplicateImageFile(name, size);
      devLog("sever.js saveFiles", name, lastModified, size, isDuplicate);
      if (!isDuplicate) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // 중복이 아닌 경우 파일 저장
        await fs.writeFile(filePath, buffer);
        return savename; // 저장한 파일명 반환
      } else {
        // 중복 파일이 있는 경우 저장 생략
        console.log(`server.js saveFiles : 동일 파일 (크기, 파일명 ) 저장 생략: ${name}`);
        return isDuplicate; // 중복된 파일은 null 반환
      }
    });
    return await Promise.all(fileUploadPromises); // 모든 파일 업로드 작업이 완료될 때까지 대기하고, 완료되면 파일 경로들의 배열을 반환
  } catch (e) {
    console.error("server.js saveFiles Function : ", e);
    return [];
  }
}

// 중복 파일 체크 함수
function checkDuplicateImageFile(name, size) {
  if (!sqlite.tableExists("images")) sqlite.db.exec(SqliteQuery.create.images);
  // devLog("server.js checkDuplicateImageFile : ", name, size);
  let result = sqlite.db.prepare("SELECT name, MAX(path) as path, COUNT(*) as count FROM images WHERE basename = ? AND size = ? GROUP BY name").get(name, size);
  return result?.count > 0 ? result.name : null;
}

async function saveData(table, key, data) {
  // jsondb.updateObject(key, data);
  if (!sqlite.tableExists(table)) SqliteQuery?.create?.[table] ? sqlite.db.exec(SqliteQuery.create?.[table]) : sqlite.createTableFromObject(table, data, true);
  sqlite.insert(table, data);
}

async function deleteData(table, key, keyValue) {
  // jsondb.deleteObject(key);
  sqlite.deleteByKey(table, key, keyValue);
}
/**
 * @param {*} table
 * @param {int} timeSecondgap
 * @returns
 */
async function getData(table, timeSecondgap = 0) {
  try {
    if (!sqlite.tableExists(table)) return null;
    // return jsondb.readObject(key, timeSecondgap);
    if (timeSecondgap) {
      const tableTime = sqlite.getTableTime(table);
      //devLog("server.js getData", timeSecondgap, table, tableTime, Date.now() - timeSecondgap * 1000, tableTime > Date.now() - timeSecondgap * 1000);
      if (tableTime > Date.now() - timeSecondgap * 1000) return sqlite.searchAll(table);
    } else return sqlite.searchAll(table);
    return null;
  } catch (e) {
    console.error("server.js getData Function : ", e);
    return null;
  }
}

/**
 * @param {*} key
 * @param {int} timeSecondgap
 * @returns
 */
async function getDataKey(table, key, keyValue, isAll = false) {
  try {
    if (!sqlite.tableExists(table)) return null;
    if (isAll) return sqlite.searchByKeyAll(table, key, keyValue);
    else return sqlite.searchByKey(table, key, keyValue);
  } catch (e) {
    console.error("server.js getDataKey Function : ", e);
    return null;
  }
}
