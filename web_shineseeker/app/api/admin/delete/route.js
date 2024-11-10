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
    if (apitype === "delete_user" && data.has("userid")) {
      await deleteData("user", "userid", data.get("userid"));
      returnData = data.get("userid") + " deleted";
    } else if (apitype === "update_skill") returnData = await updateSkill(data);
    else if (apitype === "update_job") returnData = await updateJob(data);
    else if (apitype === "update_monster") returnData = await updatMonster(data);
    else if (apitype === "update_item") returnData = await updateItem(data);
    else if (apitype === "update_patrol") returnData = await updatePatrol(data);
    return NextResponse.json({message: "upload And Images uploaded successfully " + returnData});
  } catch (error) {
    return NextResponse.json({message: "delete fail", error: error.message}, {status: 500});
  }
}
