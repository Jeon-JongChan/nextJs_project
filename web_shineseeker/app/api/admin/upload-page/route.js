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
    const pagename = apitype.split("_").pop() || "main";
    devLog("upload-page => ", data.get("apitype"), data, pagename);
    if (apitype === "update_main") returnData = await updatePage(data, pagename);
    else if (apitype === "update_raid") returnData = await updateRaidList(data, pagename);
    else returnData = await updatePage(data, pagename);
    return NextResponse.json({message: "upload And Images uploaded successfully", returnData: returnData});
  } catch (error) {
    console.log("POST error", error);
    return NextResponse.json({message: "upload-page fail", error: error.message}, {status: 500});
  }
}

// --------------- 아래는 upload 요청 중 api type에 따른 함수리스트
/*==============================================================================================================================================*/
/*================================================================== 메인 화면 ==================================================================*/
/*==============================================================================================================================================*/
async function updatePage(data, pagename) {
  // const essentialDataList = ["page_name", "page_type"];
  const exceptList = ["file", "apitype", "pagename"];
  let saveArray = [];
  let marketItemArray = []; // 교환소 너만을 위한 유일한 배열이야
  const setSaveArray = (key, data) => saveArray.push({page_name: pagename, id: key, value: data}); // 편의성을 위한 page 테이블에 저장할 배열 생성함수

  // if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  devLog(`update ${pagename} all data`, data);
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith(`${pagename}_img`)) {
        let image = null;
        if (value?.type) image = await saveImage(value); // 이미지 저장
        setSaveArray(key, image?.path || null); // 이미지 경로만 저장
      } else if (key.startsWith("market_item")) {
        marketItemArray.push(value);
      } else setSaveArray(key, value);
    }
  }
  // 교환소 아이템 데이터를 저장
  if (marketItemArray.length) setSaveArray("market_item", JSON.stringify(marketItemArray));
  if (marketItemArray.length) devLog("updatePage saveArray and Item", saveArray);

  // 기존 page 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const get_page = await getDataKey("page", "page_name", pagename, true); // page_name을 기준으로 데이터 조회
  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  for (const savedata of saveArray) {
    if (savedata.id.startsWith(`${pagename}_img`) && !savedata.value && get_page?.length) {
      const old_image = get_page.filter((page) => page.id === savedata.id)[0]?.value;
      if (old_image) savedata.value = old_image;
    }
  }

  await deleteData("page", "page_name", pagename); // 기존값 삭제 (삭제요소 대비)
  await saveData("page", saveArray, true); // 새로운 데이터 저장

  return saveArray;
}
/*==============================================================================================================================================*/
/*================================================================== 레이드 리스트 갱신 ==================================================================*/
/*==============================================================================================================================================*/
async function updateRaidList(data, pagename) {
  const essentialDataList = ["raid_name"];
  const exceptList = ["file", "apitype"];
  let raid_users = [], raid = {}, raid_name = null; // prettier-ignore
  if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  raid_name = data.get("raid_name");
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith("raid_user")) {
        if (!value) continue;
        let index = key.split("_").pop();
        let raid_order = data.get(`raid_order_${index}`);
        raid_users.push({raid_name : raid_name, raid_user: value, raid_order : raid_order});
      }
      else if (key.startsWith("raid_order")) continue // 스킬 상세정보 저장
      else raid[key] = value; // 스킬 정보 저장
    }
  }
  
  devLog("update all data ######################## ", raid, raid_users);
  deleteData("raid_list", "raid_name", raid.raid_name); // 기존값 삭제 (삭제요소 대비)
  await saveData("raid_list", raid_users, true); // 새로운 데이터 저장
  await saveData("raid", raid); // 새로운 데이터 저장

}
