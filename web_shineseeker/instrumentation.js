import {registerOTel} from "@vercel/otel";
import Sqlite from "./sqlite3-adapter.js";

let init = true; // 이 변수로 초기화가 한 번만 실행되도록 제어

export function register() {
  if (init) {
    console.log("Init Processing......");
    const sqlite = new Sqlite(); // 기본 dbPath 사용, verbose 출력 활성화
    sqlite.db.exec("CREATE TABLE session (table_name TEXT PRIMARY KEY, updated INTEGER)");
    init = false;
  }
}
