import {registerOTel} from "@vercel/otel";
import Sqlite from "./sqlite3-adapter.js";

let init = true; // 이 변수로 초기화가 한 번만 실행되도록 제어

export async function register() {
  if (init) {
    console.log("Init Processing......");
    const sqlite = new Sqlite(); // 기본 dbPath 사용, verbose 출력 활성화
    sqlite.db.exec("CREATE TABLE session (table_name TEXT PRIMARY KEY, updated INTEGER)");
    sqlite.db.exec(
      "CREATE TABLE IF NOT EXISTS user (userid TEXT PRIMARY KEY, username1 TEXT, username2 TEXT, job TEXT, addinfo1 TEXT, addinfo2 TEXT, usertab_baseinfo TEXT, usertab_detailinfo TEXT, usertab_first_word TEXT, usertab_second_word TEXT, user_hp TEXT, user_atk TEXT, user_def TEXT, user_wis TEXT, user_agi TEXT, user_luk TEXT, user_money TEXT, user_skill1 TEXT, user_skill2 TEXT, user_skill3 TEXT, user_skill4 TEXT, user_skill5 TEXT, user_img_0 TEXT, user_img_1 TEXT, user_img_2 TEXT, user_img_3 TEXT, updated INTEGER)"
    );
    sqlite.db.exec("CREATE TABLE IF NOT EXISTS user_auth (userid TEXT, userpw TEXT, role TEXT DEFAULT 'user', updated INTEGER, PRIMARY KEY(userid))");
    // admin 계정이 없으면 초기화해주면서 추가
    const admin = await getDataKey("user_auth", "userid", credentials.userid);
    if (!admin) {
      sqlite.db.run("INSERT INTO user_auth (userid, userpw, role) VALUES (?, ?, ?)", ["shineseeker", "shineseeker", "admin"]);
    }

    init = false;
  }
}
