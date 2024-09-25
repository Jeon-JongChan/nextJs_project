import path from "path";
import {NextResponse} from "next/server";
import {saveFiles, saveData, deleteData, getDataKey} from "@/_custom/scripts/server";
import SqliteQuery from "@/_custom/scripts/sqlite3-query";
import {devLog} from "@/_custom/scripts/common";

// upload에 대한 post 요청을 처리하는 함수
export async function POST(req) {
  try {
    let filePaths = [];
    const data = await req.formData();
    const apitype = data.get("apitype");
    devLog(data.get("apitype"), data);
    if (apitype === "update_user") {
      filePaths = await updateUser(data);
      return NextResponse.json({message: "upload User And Images uploaded successfully", filePaths});
    } else if (apitype === "test") {
      await test(data);
      return NextResponse.json({message: "successfully api"});
    }

    return NextResponse.json({message: "Files uploaded successfully", filePaths});
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

/* 13에서 사용 안함
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we are handling it ourselves
  },
};
*/
// --------------- 아래는 upload 요청 중 api type에 따른 함수리스트
async function updateUser(data) {
  const essentialDataList = ["userid", "userpw", "username1"];
  const exceptUserList = ["file", "apitype"];
  const imageKeyList = ["user_img_1", "user_img_2", "user_img_3", "user_img_4"];
  let user = {};
  let images = {};
  let items = [];
  if (!essentialDataList.every((key) => data.has(key))) throw new Error("One or more fields are missing");
  // if (files.length !== 0 || files.some((file) => file.type.split("/")[0] !== "image")) throw new Error("One or more files are not images");

  // 이미지와 아이템을 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptUserList.includes(key)) {
      if (key.startsWith("user_img")) {
        // 이미지 처리 진행
        if (value.type.split("/")[0] !== "image") throw new Error(`${value.name} file is not an image`);
        const imagePath = await saveFiles([value]);
        images[key] = {
          name: imagePath[0],
          basename: value.name,
          size: value.size,
          lastModified: value.lastModified,
          path: `/temp/uploads/${imagePath[0]}`,
        };

        await saveData("images", "name", images[key]); // 이미지 정보 저장
      } else if (key.startsWith("user_item")) {
        items.push(value);
      } else {
        user[key] = value;
      }
    }
  }
  Object.keys(images).map((key) => (user[key] = images[key]["path"])); // 이미지 경로를 user 객체에 추가
  await deleteData("items", "userid", user.userid); // 기존 아이템 정보 삭제
  items.forEach((item, idx) => {
    saveData("items", "userid", {userid: user.userid, item: item});
  }); // 아이템 정보를 user 객체에 추가
  // devLog("api/upload/route.js updateUser : ", data, images, user);
  await saveData("user", "userid", user);

  return Object.keys(images).map((key) => images[key].path);
}
