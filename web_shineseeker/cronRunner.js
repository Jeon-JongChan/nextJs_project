// cronRunner.js
const cron = require("node-cron");
const Sqlite = require("./_custom/scripts/sqlite3-adapter.js");

// SQLite 데이터베이스 연결
const dev = process.env.NEXT_PUBLIC_DEV === "true";
const sqlite = new Sqlite(dev);

// 크론 작업 설정
const startCronJobs = () => {
  // 예: 매일 자정에 실행
  cron.schedule("* * * * *", () => {
    console.log("Running daily task...");
    const query = `UPDATE user SET user_stamina = 5`;
    sqlite.db.prepare(query).run();
  });

  console.log(`Cron jobs have started. ${new Date().toISOString()}`);
};

// 크론 작업 실행
startCronJobs();
