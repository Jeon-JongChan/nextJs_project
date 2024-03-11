import {NextResponse} from "next/server";

const authkeys = [process.env.NEXT_ADMIN || "qwer", process.env.NEXT_USER1 || "qwer1", process.env.NEXT_USER2 || "qwer2", process.env.NEXT_USER3 || "qwer3"];
export default function handler(req, res) {
  if (!authkeys.includes(req.body.key)) {
    res.status(401).json({error: "Invalid key"});
    return;
  }
  res.setHeader("Access-Control-Allow-Origin", "*"); // 모든 출처 허용
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // 허용하는 HTTP 메소드 목록
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // 허용하는 요청 헤더 목록
  res.setHeader("Set-Cookie", "authkey=" + req.body.key + "; max-age=86400; path=/;");
  res.status(200).json({name: "John Doe"});
}
