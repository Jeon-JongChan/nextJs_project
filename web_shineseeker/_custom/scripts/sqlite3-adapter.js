import Database from "better-sqlite3";
import path from "path";

let dev = process.env.NEXT_PUBLIC_DEV || "false";
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

  // constructor(verbose = true, dbPath = path.join(process.cwd(), "public", "temp", "sqlite3.db")) { // vercel에서 process.cwd()는 /var/task로 인식해버림
  constructor(verbose = true, dbPath = "public/temp/sqlite3.db") {
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
      const stmt = this.db.prepare(`DELETE FROM ${table} WHERE ${key} = ?`);
      const result = stmt.run(keyValue);
      this.updateTableTime(table); // 테이블 갱신 시간 업데이트
      return result.changes === 0 ? null : result.changes; // 0이면 삭제 실패
    } catch (error) {
      console.error("** Sql-adapter.js(deleteByKey) Delete failed:", error);
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
  searchByKeyAll(table, key, keyValue, options = {}) {
    const {limit = 10, offset = 0} = options;
    try {
      const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE ${key} = ? LIMIT ? OFFSET ?`);
      return stmt.all(keyValue, limit, offset);
    } catch (error) {
      console.error("** Sql-adapter.js(searchByKey) Search failed:", error);
      return null; // 실패 시 null 반환
    }
  }
  // 다중 행 검색 함수 (옵션 추가)
  searchAll(table, options = {}) {
    const {limit = 10, offset = 0} = options;
    try {
      const stmt = this.db.prepare(`SELECT * FROM ${table} LIMIT ? OFFSET ?`);
      return stmt.all(limit, offset);
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

// 모듈을 CommonJS 방식으로도 사용 가능하게 함
if (typeof module !== "undefined" && module.exports) {
  module.exports = DBManager;
}

export default DBManager;
