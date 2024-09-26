import {NextResponse} from "next/server";
import {saveFiles, saveData, getDataKey, deleteData, truncateData} from "@/_custom/scripts/server";
import {devLog} from "@/_custom/scripts/common";

const imageDir = "/temp/uploads";
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
    } else if (apitype === "update_skill") {
      filePaths = await updateSkill(data);
      return NextResponse.json({message: "upload Skill And Images uploaded successfully", filePaths});
    }
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
  return NextResponse.json({message: "Files uploaded successfully"});
}

async function saveImage(file) {
  if (file.type.split("/")[0] !== "image") throw new Error(`${file.name} file is not an image`);
  const imagePath = await saveFiles([file]);
  const imageData = {
    name: imagePath[0],
    basename: file.name,
    size: file.size,
    lastModified: file.lastModified,
    path: `${imageDir}/${imagePath[0]}`,
  };
  await saveData("images", imageData);
  return imageData;
}
async function updateSkill(data) {
  const essentialDataList = ["skill_name"];
  const exceptList = ["file", "apitype"];
  let skill = {}, images = {}, skills_detail = {}; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");

  devLog("updateSkill all data", data);
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith("skill_img")) images[key] = await saveImage(value); // 이미지 저장
      else if (key.startsWith("skill_detail")) skills_detail[key] = value; // 스킬 상세정보 저장
      else skill[key] = value; // 스킬 정보 저장
    }
  }
  // 기존 skill 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const existingSkill = await getDataKey("skill", "skill_name", skill["skill_name"]); // skill_name을 기준으로 데이터 조회

  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  ["skill_img_0", "skill_img_1"].forEach((imgKey) => {
    if (!data.has(imgKey) && existingSkill && existingSkill[imgKey]) {
      skill[imgKey] = existingSkill[imgKey]; // 기존 이미지 경로 유지
    } else skill[imgKey] = images[imgKey]?.path || null;
  });

  await truncateData("skill_detail"); // 한줄이므로 걍 삭세하고 넣어버려
  saveData("skill_detail", skills_detail); // 스킬 상세정보 저장
  await saveData("skill", skill);

  return skill;
}
// --------------- 아래는 upload 요청 중 api type에 따른 함수리스트
async function updateUser(data) {
  const essentialDataList = ["userid", "userpw", "username1"];
  const exceptUserList = ["file", "apitype"];
  let user = {},images = {}, items = []; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");

  // 이미지와 아이템을 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptUserList.includes(key)) {
      if (key.startsWith("user_img")) images[key] = await saveImage(value); // 이미지 저장
      else if (key.startsWith("user_item")) items.push(value); // 아이템 저장
      else user[key] = value; // 유저 정보 저장
    }
  }
  // 기존 skill 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const existingUser = await getDataKey("user", "userid", user["userid"]); // skill_name을 기준으로 데이터 조회
  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  ["user_img_0", "user_img_1", "user_img_2", "user_img_3"].forEach((imgKey) => {
    if (!data.has(imgKey) && existingUser && existingUser[imgKey]) {
      user[imgKey] = existingUser[imgKey]; // 기존 이미지 경로 유지
    } else user[imgKey] = images[imgKey]?.path || null;
  });
  await deleteData("items", "userid", user.userid); // 기존 아이템 정보 삭제
  items.forEach((item, idx) => saveData("items", {userid: user.userid, item: item})); // 아이템 정보를 user 객체에 추가
  await saveData("user", user);

  return user;
}
