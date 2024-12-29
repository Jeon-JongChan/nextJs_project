import {NextResponse} from "next/server";
import {saveFiles, saveImage, saveData, getDataKey, deleteData, truncateData} from "@/_custom/scripts/server";
import {devLog} from "@/_custom/scripts/common";

const imageDir = "/temp/uploads";
// upload에 대한 post 요청을 처리하는 함수
export async function POST(req) {
  try {
    let returnData = null;
    const data = await req.formData();
    const apitype = data.get("apitype");
    devLog(data.get("apitype"), data);
    if (apitype === "update_user") returnData = await updateUser(data);
    else if (apitype === "update_skill") returnData = await updateSkill(data);
    else if (apitype === "update_job") returnData = await updateJob(data);
    else if (apitype === "update_monster") returnData = await updatMonster(data);
    else if (apitype === "update_item") returnData = await updateItem(data);
    else if (apitype === "update_patrol") returnData = await updatePatrol(data);
    else if (apitype === "update_raid") returnData = await updateRaid(data);
    return NextResponse.json({message: "upload And Images uploaded successfully", returnData: returnData});
  } catch (error) {
    return NextResponse.json({message: "upload fail", error: error.message}, {status: 500});
  }
}

// --------------- 아래는 upload 요청 중 api type에 따른 함수리스트
/*==============================================================================================================================================*/
/*================================================================== 유저 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updateUser(data) {
  const essentialDataList = ["userid", "userpw", "username1"];
  const exceptUserList = ["file", "apitype", "userpw", "role"];
  let user = {},images = {},items = [],auth = {},skills=[] // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  if (!data.get("userid")) throw new Error("userid is required");

  // 이미지와 아이템을 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptUserList.includes(key)) {
      if (key.startsWith("user_img")) images[key] = await saveImage(value); // 이미지 저장
      else if (key.startsWith("user_item")) items.push(value); // 아이템 저장
      else if (key.startsWith("user_skillList")) {
        if (!skills.includes(value)) skills.push(value); // 스킬 저장 및 중복 스킬은 저장 X
      } else user[key] = value; // 유저 정보 저장
    } else if (key === "userpw" || key === "role") auth[key] = value; // 유저 인증 정보 저장
  }
  auth["userid"] = user["userid"];

  // 기존 skill 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const existingData = await getDataKey("user", "userid", user["userid"]); // skill_name을 기준으로 데이터 조회
  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  ["user_img_0", "user_img_1", "user_img_2", "user_img_3", "user_img_4"].forEach((imgKey) => {
    if (!data.has(imgKey) && existingData && existingData[imgKey]) {
      user[imgKey] = existingData[imgKey]; // 기존 이미지 경로 유지
    } else user[imgKey] = images[imgKey]?.path || null;
  });
  await deleteData("user_item", "userid", user.userid); // 기존 아이템 정보 삭제
  await deleteData("user_skill", "userid", user.userid); // 기존 스킬리스트 정보 삭제
  devLog("updateUser all data", user, items, skills);
  items.forEach((item, idx) => saveData("user_item", {userid: user.userid, item: item})); // 아이템 정보를 user_item 객체에 추가
  skills.forEach((skill, idx) => {
    if (skill) saveData("user_skill", {userid: user.userid, skill_name: skill});
  }); // 스킬리스트 정보를 user_skill 객체에 추가
  await saveData("user", user);
  await saveData("user_auth", auth);

  return user;
}
/*==============================================================================================================================================*/
/*================================================================== 스킬 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updateSkill(data) {
  const essentialDataList = ["skill_name"];
  const exceptList = ["file", "apitype"];
  let skill = {}, images = {}, skills_detail = {}, skill_operator = {}; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  if (!data.get("skill_name")) throw new Error("skill_name is required");

  devLog("updateSkill all data", data);
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith("skill_img")) images[key] = await saveImage(value); // 이미지 저장
      // else if (key.startsWith("skill_option")) skills_detail[key] = value; // 스킬 상세정보 저장
      else if (key.startsWith("skill_operator")) {
        // 24.12.29 연산자 추가
        let index = parseInt(key.split("_").pop());
        if (!skill_operator?.[index]) skill_operator[index] = {skill_name: data.get("skill_name")};
        skill_operator[index][key.replace(`_${index}`, "")] = value === "" ? null : value; // 스킬 상세정보 저장
      } else skill[key] = value; // 스킬 정보 저장
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

  // 24.12.29 연산자 추가
  const operators = Object.values(skill_operator);
  await deleteData("skill_operator", "skill_name", skill.skill_name); // 기존 스킬 연산자 정보 삭제
  saveData("skill_operator", operators, true); // 스킬 연산자 정보 저장

  // await truncateData("skill_option"); // 한줄이므로 걍 삭세하고 넣어버려
  // saveData("skill_option", skills_detail); // 스킬 상세정보 저장
  await saveData("skill", skill);

  return skill;
}
/*==============================================================================================================================================*/
/*================================================================== 직업 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updateJob(data) {
  const essentialDataList = ["job_name"];
  const exceptUserList = ["file", "apitype"];
  let job = {},images = {}, skill = []; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  if (!data.get("job_name")) throw new Error("job_name is required");

  // 이미지와 아이템을 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptUserList.includes(key)) {
      if (key.startsWith("job_img")) images[key] = await saveImage(value); // 이미지 저장
      else if (key.startsWith("job_skill")) skill.push(value); // 스킬 저장
      else job[key] = value; // 직업 정보 저장
    }
  }
  // 기존 skill 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const existingData = await getDataKey("job", "job_name", job["job_name"]); // job_name 기준으로 데이터 조회
  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  ["job_img_0"].forEach((imgKey) => {
    if (!data.has(imgKey) && existingData && existingData[imgKey]) {
      job[imgKey] = existingData[imgKey]; // 기존 이미지 경로 유지
    } else job[imgKey] = images[imgKey]?.path || null;
  });
  await deleteData("job_skill", "job_name", job.job_name); // 기존 스킬정보를 삭제하지 않고 중복일 경우 추가 안되게 primary key로 묶음
  skill.forEach((skill, idx) => saveData("job_skill", {job_name: job.job_name, skill_name: skill})); // 스킬 정보를 job_skill 객체에 추가
  await saveData("job", job);

  return job;
}
/*==============================================================================================================================================*/
/*================================================================== 몬스터 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updatMonster(data) {
  const essentialDataList = ["monster_name"];
  const exceptUserList = ["file", "apitype"];
  let monster = {},images = {}, items = [], monster_event=[], skills_detail = {}; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  if (!data.get("monster_name")) throw new Error("monster_name is required");

  // 이미지와 아이템을 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptUserList.includes(key)) {
      if (key.startsWith("monster_img")) images[key] = await saveImage(value); // 이미지 저장
      // else if (key.startsWith("skill_option")) skills_detail[key] = value; // 스킬 상세정보 저장 - 24.12.29 삭제
      else if (key.startsWith("monster_event")) {
        let index = parseInt(key.split("_").pop());
        if (!monster_event[index]) monster_event[index] = {monster_name: data.get("monster_name"), monster_event_idx: index};
        if (key.startsWith("monster_event_img")) images[key] = await saveImage(value); // 이미지 저장
        else monster_event[index][key.replace(`_${index}`, "")] = value;
      } else monster[key] = value; // 유저 정보 저장
    }
  }

  // 기존 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const existingData = await getDataKey("monster", "monster_name", monster["monster_name"]); // skill_name을 기준으로 데이터 조회
  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  ["monster_img_0"].forEach((imgKey) => {
    if (!data.has(imgKey) && existingData && existingData[imgKey]) {
      monster[imgKey] = existingData[imgKey]; // 기존 이미지 경로 유지
    } else monster[imgKey] = images[imgKey]?.path || null;
  });
  // 몬스터 이벤트의 이미지가 기존에는 있고 새로 전송된 이미지는 없을 경우 기존경로 유지
  const eventExistingData = await getDataKey("monster_event", "monster_name", monster["monster_name"], true); // skill_name을 기준으로 데이터 조회
  devLog("eventExistingData", eventExistingData);
  let eventImgData = eventExistingData?.reduce((acc, cur) => {
    acc[`monster_event_img_${cur.monster_event_idx}`] = cur.monster_event_img;
    devLog("acc", acc, cur);
    return acc;
  }, {});
  devLog("eventImgData", eventExistingData);

  ["monster_event_img_0", "monster_event_img_1", "monster_event_img_2", "monster_event_img_3", "monster_event_img_4"].forEach((imgKey, index) => {
    if (!data.has(imgKey) && eventImgData && eventImgData[imgKey]) {
      monster_event[index]["monster_event_img"] = eventImgData[imgKey]; // 기존 이미지 경로 유지
    } else monster_event[index]["monster_event_img"] = images[imgKey]?.path || null;
  });

  // await deleteData("monster_event", "monster_name", monster.monster_name); // 기존 정보 삭제 - 24.12.29 삭제
  // monster_event.forEach((monster_skill, idx) => {
  //   monster_skill["monster_name"] = monster["monster_name"];
  //   monster_skill["monster_event_idx"] = idx;
  //   saveData("monster_event", monster_skill);
  // });
  await saveData("monster_event", monster_event, true); // 몬스터 이벤트 저장
  // await truncateData("skill_option"); // 한줄이므로 걍 삭세하고 넣어버려
  // saveData("skill_option", skills_detail); // 스킬 상세정보 저장
  await saveData("monster", monster);

  return monster;
}
/*==============================================================================================================================================*/
/*================================================================== 아이템 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updateItem(data) {
  const essentialDataList = ["item_name"];
  const exceptList = ["file", "apitype"];
  let item = {}, images = {}, items_option = {}; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  if (!data.get("item_name")) throw new Error("item_name is required");

  devLog("update Item all data", data);
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith("item_img")) images[key] = await saveImage(value); // 이미지 저장
      else if (key.startsWith("item_option")) items_option[key] = value; // 스킬 상세정보 저장
      else item[key] = value; // 스킬 정보 저장
    }
  }
  // 기존 item 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const existingItem = await getDataKey("item", "item_name", item["item_name"]); // item_name을 기준으로 데이터 조회

  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  ["item_img_0"].forEach((imgKey) => {
    if (!data.has(imgKey) && existingItem && existingItem[imgKey]) {
      item[imgKey] = existingItem[imgKey]; // 기존 이미지 경로 유지
    } else item[imgKey] = images[imgKey]?.path || null;
  });

  await truncateData("item_option"); // 한줄이므로 걍 삭세하고 넣어버려
  saveData("item_option", items_option); // 스킬 상세정보 저장
  await saveData("item", item);

  return item;
}
/*==============================================================================================================================================*/
/*================================================================== 패트롤 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updatePatrol(data) {
  const essentialDataList = ["patrol_name", "patrol_type"];
  const exceptList = ["file", "apitype"];
  let patrol = {}, images = {}, patrol_ret = {}; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  if (!data.get("patrol_name")) throw new Error("patrol_name is required");

  devLog("update Item all data", data);
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith("patrol_img")) images[key] = await saveImage(value); // 이미지 저장
      else if (key.startsWith("patrol_ret")) {
        let index = parseInt(key.split("_").pop());
        if (!patrol_ret?.[index]) patrol_ret[index] = {patrol_ret_idx: index};
        if (key.startsWith("patrol_ret_img")) images[key] = await saveImage(value); // 이미지 저장
        else {
          patrol_ret[index][key.replace(`_${index}`, "")] = value; // 패트롤 상세정보 저장
          patrol_ret[index]["patrol_select"] = data.get(`patrol_select_${index}`); // 패트롤 선택 정보 저장
        }
      } else if (!key.startsWith("patrol_select")) patrol[key] = value; // 패트롤 정보 저장
    }
  }
  // 기존 patrol 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const get_patrol = await getDataKey("patrol", "patrol_name", patrol["patrol_name"]); // patrol_name을 기준으로 데이터 조회
  const get_patrol_ret = await getDataKey("patrol_result", "patrol_name", patrol["patrol_name"], true); // patrol_name을 기준으로 데이터 조회
  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  ["patrol_img", "patrol_img_fail"].forEach((imgKey) => {
    if (!data.has(imgKey)) patrol[imgKey] = get_patrol?.[imgKey];
    else patrol[imgKey] = images[imgKey]?.path || null;
  });
  if (get_patrol_ret) {
    for (const ret of get_patrol_ret) {
      if (patrol_ret?.[ret.patrol_ret_idx]) {
        if (!data.has(`patrol_ret_img_${ret.patrol_ret_idx}`)) patrol_ret[ret.patrol_ret_idx].patrol_ret_img = ret["patrol_ret_img"];
        else patrol_ret[ret.patrol_ret_idx].patrol_ret_img = images[`patrol_ret_img_${ret.patrol_ret_idx}`]?.path || null;
      }
    }
  }

  await deleteData("patrol_result", "patrol_name", patrol.patrol_name); // 기존 패트롤 결과값 삭제 (만약 줄이고 싶을경우 대비)
  for (const value of Object.values(patrol_ret)) {
    await saveData("patrol_result", {patrol_name: patrol.patrol_name, ...value}); // 패트롤 결과값 저장
  }
  await saveData("patrol", patrol);

  return patrol;
}
/*==============================================================================================================================================*/
/*================================================================== 레이드 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updateRaid(data) {
  const essentialDataList = ["raid_name", "monster_name"];
  const exceptList = ["file", "apitype"];
  let raid = {}, images = {}; // prettier-ignore

  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  if (!data.get("raid_name")) throw new Error("raid_name is required");

  devLog("update Item all data", data);
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith("raid_img")) images[key] = await saveImage(value); // 이미지 저장
      else raid[key] = value;
    }
  }
  await saveData("raid", raid);

  return raid;
}
