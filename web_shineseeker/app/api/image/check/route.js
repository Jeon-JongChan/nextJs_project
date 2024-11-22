import fs from "fs";
import path from "path";
import {NextResponse} from "next/server";

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const src = searchParams.get("src");

  // src에서 파일명만 추출 (ex: "/temp/upload/이미지.png" -> "이미지.png")
  const fileName = path.basename(src); // '/temp/upload/이미지.png' -> '이미지.png'

  // 정적 파일 경로 설정
  const staticFilePath = path.join(process.cwd(), ".next", "static", "media", fileName);

  // 파일이 존재하는지 확인
  if (fs.existsSync(staticFilePath)) {
    // 정적 이미지
    return NextResponse.json({isStatic: true, src: `${fileName}`});
  } else {
    // 동적 이미지
    return NextResponse.json({isStatic: false, src: `/api/image?src=${src}`});
  }
}
