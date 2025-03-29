/** @type {import('next').NextConfig} */
// const external_host = process.env.NEXT_PUBLIC_EXTERNAL_HOST;
// const host = process.env.NEXT_PUBLIC_HOST;
const domain = process.env.NEXT_PUBLIC_DOMAIN;
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [`${domain}`],
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
  const server = (await import("./scripts/server.js")).default;
  // const sql = (await import("./scripts/create.js")).default;
  server.init();
}

// Next.js 서버가 시작될 때 데이터베이스 초기화 실행
initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error);
});

module.exports = nextConfig;
