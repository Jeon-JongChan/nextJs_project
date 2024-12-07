// import Database from "better-sqlite3";
// sqlite3-adapter.js
let Database = null;
// CommonJS 방식으로 import
if (typeof require !== "undefined") {
  // CommonJS 환경에서는 require 사용
  Database = require("better-sqlite3");
} else {
  // ES 모듈 환경에서는 import 사용
  import("better-sqlite3")
    .then((mod) => {
      Database = mod.default; // 비동기적으로 import 후, Database를 설정
    })
    .catch((error) => {
      console.error("Failed to load the module with import:", error);
    });
}

let dev = process.env.NEXT_PUBLIC_DEV || "false";
const server = process.env.NEXT_SERVER || "";
let devLog = (...msg) => {
  if (dev == "true" || dev == "dev") {
    console.log("############### dev Log ###############\n", ...msg);
  }
};

class DBManager {
  static finalizationRegistry = new FinalizationRegistry((db) => {
    if (db) {
      db.close();
      console.log("Database connection automatically closed.");
    }
  });

  constructor(verbose = true, dbPath = null) {
    if (server == "vercel") dbPath = "/tmp/sqlite3.db"; // vercel에서 process.cwd()는 /var/task로 인식해버림
    if (!dbPath) dbPath = `${process.cwd()}/public/temp/sqlite3.db`;

    this.db = new Database(dbPath, {verbose: verbose ? console.log : undefined});
    DBManager.finalizationRegistry.register(this, this.db);

    if (this.db) {
      if (!this.tableExists("table_update")) {
        console.log("Creating table_update table...");
        this.db.exec("CREATE TABLE table_update (table_name TEXT PRIMARY KEY, updated INTEGER)");
      }
    }
  }

  // 테이블 갱신 시간 업데이트
  updateTableTime(table) {
    const stmt = this.db.prepare("INSERT OR REPLACE INTO table_update (table_name, updated) VALUES (?, ?)");
    stmt.run(table, Date.now());
  }

  // 테이블 갱신 시간 조회
  getTableTime(table) {
    try {
      const stmt = this.db.prepare("SELECT updated FROM table_update WHERE table_name = ?");
      const result = stmt.get(table);

      if (result) return result.updated; // 객체 대신 updated 값만 반환
      else return null; // 테이블이 없는 경우 null 반환
    } catch (error) {
      console.error("** Sql-adapter.js(getTableTime) Error retrieving table update time:", error);
      return null; // 오류 발생 시 null 반환
    }
  }

  // 테이블 존재 여부 확인
  tableExists(table) {
    try {
      const stmt = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
      const result = stmt.get(table);
      return result !== undefined; // 테이블이 존재하면 true, 아니면 false
    } catch (error) {
      console.error("** Sql-adapter.js(tableExists) Check table existence failed:", error);
      return false; // 오류 발생 시 false 반환
    }
  }

  /**
   * 특정 객체를 기반으로 테이블 생성
   * @param {*} table
   * @param {*} obj
   * @param {*} isFirstPrimary
   * @returns
   */
  createTableFromObject(table, obj, isFirstPrimary = false) {
    if (this.tableExists(table)) {
      console.log(`Table '${table}' already exists.`);
      return false; // 테이블이 이미 존재하는 경우
    }

    const entries = Object.entries(obj);
    let columns = "";
    let startIdx = 0;

    // 첫 번째 열을 PRIMARY KEY로 설정
    if (isFirstPrimary) {
      const [firstKey, firstValue] = entries[0];
      const type = typeof firstValue === "number" ? "INTEGER" : "TEXT"; // 데이터 타입 결정
      columns = `${firstKey} ${type} PRIMARY KEY, `; // 첫 번째 열은 PRIMARY KEY로 설정
      startIdx = 1; // 나머지 열은 1부터 시작
    }

    // 나머지 열에 대한 처리 ( PRIMARY KEY로 설정없을경우 0부터 시작)
    // prettier-ignore
    columns += entries.slice(startIdx).map(([key, value]) => { 
        const type = typeof value === "number" ? "INTEGER" : "TEXT"; // 데이터 타입 결정
        return `${key} ${type}`;
      }).join(", ");

    columns += ", updated INTEGER"; // updated 필드 추가
    const sql = `CREATE TABLE IF NOT EXISTS ${table} (${columns})`;

    try {
      this.db.exec(sql);
      this.updateTableTime(table);
      return true; // 테이블 생성 성공
    } catch (error) {
      console.error("** Sql-adapter.js(createTableFromObject) Table creation failed:", error);
      return false; // 테이블 생성 실패
    }
  }

  // 수정 함수
  updateByKey(table, key, keyValue, data) {
    try {
      let columns = Object.keys(data).map((k) => `${k} = ?`).join(", "); // prettier-ignore
      columns += ", updated = ?"; // updated 필드 추가
      let values = Object.values(data);
      values.push(Date.now()); // updated 필드 값 추가
      const stmt = this.db.prepare(`UPDATE ${table} SET ${columns} WHERE ${key} = ?`);

      devLog("sqlite3-adapter.js : updateByKey", columns, ...values, keyValue);
      const result = stmt.run(...values, keyValue);
      this.updateTableTime(table); // 테이블 갱신 시간 업데이트
      return result.changes === 0 ? null : result.changes; // 0이면 변경 없음
    } catch (error) {
      console.error("** Sql-adapter.js(updateByKey) Update failed:", error);
      return false; // 실패 시 false 반환
    }
  }

  // 삭제 함수
  deleteByKey(table, key, keyValue) {
    try {
      if (!this.tableExists(table)) return false; // 테이블이 없는 경우
      const stmt = this.db.prepare(`DELETE FROM ${table} WHERE ${key} = ?`);
      const result = stmt.run(keyValue);
      this.updateTableTime(table); // 테이블 갱신 시간 업데이트
      return result.changes === 0 ? null : result.changes; // 0이면 삭제 실패
    } catch (error) {
      console.error("** Sql-adapter.js(deleteByKey) Delete failed:", error);
      return false; // 실패 시 false 반환
    }
  }
  // 삭제 함수 (여러 키 지원)
  deleteByKeys(table, keys = {}) {
    try {
      if (!this.tableExists(table)) return false; // 테이블이 없는 경우

      // keys 객체에서 키-값 쌍을 추출하여 WHERE 절을 동적으로 생성
      const keyColumns = Object.keys(keys);
      if (keyColumns.length === 0) throw new Error("No keys provided for deletion");

      // WHERE 절 생성: 'key1 = ? AND key2 = ? ...'
      const whereClause = keyColumns.map((key) => `${key} = ?`).join(" AND ");

      // 해당 키-값 쌍에 대응하는 값을 추출하여 prepared statement에 넣을 배열 생성
      const values = Object.values(keys);

      // DELETE 쿼리 실행
      const stmt = this.db.prepare(`DELETE FROM ${table} WHERE ${whereClause}`);
      const result = stmt.run(...values);

      this.updateTableTime(table); // 테이블 갱신 시간 업데이트
      return result.changes === 0 ? null : result.changes; // 0이면 삭제 실패
    } catch (error) {
      console.error("** Sql-adapter.js(deleteByKeys) Delete failed:", error);
      return false; // 실패 시 false 반환
    }
  }

  // 삭제 함수
  truncate(table) {
    try {
      if (!this.tableExists(table)) return false; // 테이블이 없는 경우
      this.db.exec(`DELETE FROM ${table}`);
      this.updateTableTime(table); // 테이블 갱신 시간 업데이트
      return true; // 삭제 성공
    } catch (error) {
      console.error("** Sql-adapter.js(truncate) truncate failed:", error);
      return false; // 실패 시 false 반환
    }
  }

  // 데이터 삽입
  insert(table, data, isReplace = true) {
    try {
      let columns = Object.keys(data).join(", ");
      columns += ", updated"; // updated 필드 추가
      let placeholders = Object.keys(data).map(() => "?").join(", "); // prettier-ignore
      placeholders += ", ?"; // updated 필드 값 추가
      let stmt = this.db.prepare(`INSERT ${isReplace ? "OR REPLACE" : ""} INTO ${table} (${columns}) VALUES (${placeholders})`);
      const values = [...Object.values(data), Date.now()]; // 데이터 값 + updated 필드 값 추가

      // devLog("sqlite3-adapter.js : insert", columns, values, stmt);
      const result = stmt.run(values);
      this.updateTableTime(table); // 테이블 갱신 시간 업데이트
      return result.changes === 0 ? null : result.changes; // 0이면 삽입 실패
    } catch (error) {
      console.error("** Sql-adapter.js(insert) Insert failed:", error);
      return false; // 실패 시 false 반환
    }
  }
  // 데이터 삽입 (한 번의 쿼리로 여러 데이터 삽입)
  multiInsert(table, dataArray, isReplace = true) {
    try {
      if (!Array.isArray(dataArray)) throw new Error("Input data must be an array of objects");
      if (dataArray.length === 0) throw new Error("Input array is empty");

      console.info("sqlite3-adapter.js : multiInsert", table, dataArray, isReplace);

      const columns = Object.keys(dataArray[0]).join(", ") + ", updated"; // 컬럼 목록에 updated 필드 추가

      const placeholdersArray = dataArray
        .map(() => {
          const placeholders = Object.keys(dataArray[0])
            .map(() => "?")
            .join(", "); // 객체의 키마다 ? 표시
          return `(${placeholders}, ?)`; // 각 객체마다 updated 값도 추가
        })
        .join(", ");

      const stmt = this.db.prepare(`INSERT ${isReplace ? "OR REPLACE" : ""} INTO ${table} (${columns}) VALUES ${placeholdersArray}`);

      // 모든 데이터 값을 모아 하나의 배열로 합침
      const values = dataArray.reduce((acc, data) => {
        const rowValues = [...Object.values(data), Date.now()]; // 각 객체의 값과 updated 값 추가
        return acc.concat(rowValues);
      }, []);

      const result = stmt.run(values);
      this.updateTableTime(table); // 테이블 갱신 시간 업데이트

      return result.changes === 0 ? null : result.changes; // 0이면 삽입 실패
    } catch (error) {
      console.error("** Sql-adapter.js(insert) Insert failed:", error);
      return false; // 실패 시 false 반환
    }
  }

  // 검색 함수 (단일 행 조회)
  searchByKey(table, key, keyValue) {
    try {
      const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE ${key} = ?`);
      return stmt.get(keyValue);
    } catch (error) {
      console.error("** Sql-adapter.js(searchByKey) Search failed:", error);
      return null; // 실패 시 null 반환
    }
  }

  // 검색 함수 (전체 행 조회)
  searchByKeyAll(table, key, keyValue, isLimit = true, options = {}) {
    const {limit = 10, offset = 0, order = 0, orderDirection = "ASC"} = options;
    try {
      const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE ${key} = ? ${isLimit ? "LIMIT ? OFFSET ?" : ""} ${order ? `ORDER BY ${order} ${orderDirection}` : ""}`);
      return isLimit ? stmt.all(keyValue, limit, offset) : stmt.all(keyValue);
    } catch (error) {
      console.error("** Sql-adapter.js(searchByKey) Search failed:", error);
      return null; // 실패 시 null 반환
    }
  }
  // 다중 행 검색 함수 (옵션 추가)
  searchAll(table, isLimit = true, options = {}) {
    const {limit = 10, offset = 0, order = 0, orderDirection = "ASC"} = options;
    try {
      let stmt = this.db.prepare(`SELECT * FROM ${table} ${order ? `ORDER BY ${order} ${orderDirection}` : ""}`);
      if (isLimit) {
        stmt = this.db.prepare(`SELECT * FROM ${table} LIMIT ? OFFSET ? ${order ? `ORDER BY ${order} ${orderDirection}` : ""}`);
        return stmt.all(limit, offset);
      } else {
        return stmt.all();
      }
    } catch (error) {
      console.error("** Sql-adapter.js(searchAll) Search all failed:", error);
      return false;
    }
  }

  // 명시적으로 닫고 싶을 때 사용할 수 있는 메서드
  close() {
    if (this.db) {
      this.db.close();
      console.log("Database connection manually closed.");
    }
  }
}

// 모듈을 CommonJS 방식으로 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = DBManager; // CommonJS 방식으로 내보내기
}

// ES 모듈 방식으로 내보내기 (default export 처리)
if (typeof exports === "object" && typeof module !== "undefined") {
  module.exports.default = DBManager; // default export로도 내보내기
}

// export default DBManager;
