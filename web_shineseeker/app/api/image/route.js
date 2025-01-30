// app/api/getImage/route.js
import fs from "fs";
import path from "path";
import {NextResponse} from "next/server";
import sharp from "sharp";
import zlib from "zlib";
import {devLog} from "@/_custom/scripts/common";

// MIME 타입 매핑
const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
  // 필요에 따라 더 추가할 수 있습니다.
};

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const src = path.join(process.cwd(), "public", searchParams.get("src"));
  const sizeParam = searchParams.get("size");

  let width, height;
  if (sizeParam) {
    const [w, h] = sizeParam.split("x").map(Number); // '512x512' 형식에서 분리
    if (!isNaN(w) && !isNaN(h)) {
      width = w;
      height = h;
    }
  }

  // 파일이 존재하는지 확인
  if (fs.existsSync(src)) {
    const ext = path.extname(src).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    let image = fs.readFileSync(src);

    // 이미지 리사이징 처리
    if (width && height) {
      image = await sharp(image)
        .resize(width, height, {fit: "inside"}) // 비율 유지하며 리사이징
        .toBuffer();
    }
    // devLog("app/api/getImage/route.js : image", src);

    // 이미지 압축 (gzip)
    const compressedImage = zlib.gzipSync(image);

    return new NextResponse(compressedImage, {
      headers: {
        "Content-Type": mimeType,
        "Content-Encoding": "gzip", // 압축 형식을 gzip으로 지정
      },
    });
  } else {
    return NextResponse.json({error: "Image not found"}, {status: 404});
  }
}
