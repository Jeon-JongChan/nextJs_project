/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

// 초기화 함수 정의
async function initializeDatabase() {
  // temp 폴더 없으면 생성
  const fs = (await import("fs")).default;
  const tempFolderPath = "./public/temp";

  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath, {recursive: true});
    console.log("📁 public/temp 폴더가 생성되었습니다.");
  }
  // 비동기 import로 SQLite 어댑터 가져오기
  const Sqlite = (await import("./_custom/scripts/sqlite3-adapter.js")).default;
  const sql = (await import("./_custom/scripts/sqlite3-query.js")).default;

  // SQLite 인스턴스 생성
  const sqlite = new Sqlite(); // 기본 dbPath 사용, verbose 출력 활성화

  // 테이블 생성
  sqlite.db.exec("CREATE TABLE IF NOT EXISTS session (table_name TEXT PRIMARY KEY, updated INTEGER)");
  sqlite.db.exec(sql.create.user);
  sqlite.db.exec(sql.create.user_auth);
  sqlite.db.exec(sql.create.log);

  // admin 계정이 없으면 초기화해주면서 추가
  const prepare = sqlite.db.prepare("SELECT * FROM user_auth WHERE userid = ?");
  const admin = prepare.get("shineseekeradmin");

  if (!admin) {
    sqlite.db.prepare("INSERT INTO user (userid) VALUES (?)").run(["shineseekeradmin"]);
    sqlite.db.prepare("INSERT INTO user_auth (userid, userpw, role) VALUES (?, ?, ?)").run(["shineseekeradmin", "shineseekeradmin", "admin"]);
  }
}

// Next.js 서버가 시작될 때 데이터베이스 초기화 실행
initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error);
});

export default nextConfig;
