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
    devLog("upload-page - ", data.get("apitype"), data);
    if (apitype === "update_main") returnData = await updateMain(data);
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
async function updateMain(data) {
  // const essentialDataList = ["page_name", "page_type"];
  const pagename = "main";
  const exceptList = ["file", "apitype"];
  let saveArray = [];
  const setSaveArray = (key, data) => saveArray.push({page_name: pagename, id: key, value: data}); // 편의성을 위한 page 테이블에 저장할 배열 생성함수

  // if (!essentialDataList.every((key) => data.has(key)) && !data?.key) throw new Error("One or more fields are missing");
  // devLog(`update ${pagename} all data`, data);
  // 이미지를 제외한 데이터만 추출
  for (const [key, value] of data.entries()) {
    if (!exceptList.includes(key)) {
      if (key.startsWith(`${pagename}_img`)) {
        let image = null;
        if (value) image = await saveImage(value); // 이미지 저장
        setSaveArray(key, image?.name || null); // 이미지 경로만 저장
      } else setSaveArray(key, value);
    }
  }
  // 기존 page 데이터에서 이미지 경로 가져오기 (필요할 때만 업데이트)
  const get_page = await getDataKey(pagename, "page_name", pagename, true); // page_name을 기준으로 데이터 조회
  // 기존 이미지 경로가 있고 새로 전송된 이미지가 없을 때 기존 경로 유지
  for (const savedata of saveArray) {
    if (savedata.id.startsWith(`${pagename}_img`) && !savedata.value) {
      const old_image = get_page.filter((page) => page.id === savedata.id)[0]?.value;
      if (old_image) savedata.value = old_image;
    }
  }

  await deleteData("page", "page_name", pagename); // 기존값 삭제 (삭제요소 대비)
  await saveData("page", saveArray, true); // 새로운 데이터 저장

  return saveArray;
}
