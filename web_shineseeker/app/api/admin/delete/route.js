import {NextResponse} from "next/server";
import {saveFiles, saveImage, saveData, getDataKey, executeQuery, deleteData, truncateData} from "@/_custom/scripts/server";
import query from "@/_custom/scripts/sqlite3-query";
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
      await deleteData("user_item", "userid", data.get("userid"));
      await deleteData("user_auth", "userid", data.get("userid"));
      await deleteData("user_skill", "userid", data.get("userid"));
      await deleteData("log", "user_name", data.get("userid"));
      returnData = data.get("userid") + " deleted";
    } else if (apitype === "delete_skill" && data.has("skill")) {
      await deleteData("skill", "skill_name", data.get("skill"));
      await deleteData("skill_operator", "skill_name", data.get("skill"));
      returnData = data.get("skill") + " deleted";
    } else if (apitype === "delete_job" && data.has("job")) {
      await deleteData("job", "job_name", data.get("job"));
      await deleteData("job_skill", "job_name", data.get("job"));
      returnData = data.get("job") + " deleted";
    } else if (apitype === "delete_monster" && data.has("monster")) {
      await deleteData("monster", "monster_name", data.get("monster"));
      await deleteData("monster_event", "monster_name", data.get("monster"));
      returnData = data.get("monster") + " deleted";
    } else if (apitype === "delete_item" && data.has("item")) {
      await deleteData("item", "item_name", data.get("item"));
      returnData = data.get("item") + " deleted";
    } else if (apitype === "delete_patrol" && data.has("patrol")) {
      await deleteData("patrol", "patrol_name", data.get("patrol"));
      await deleteData("patrol_result", "patrol_name", data.get("patrol"));
      returnData = data.get("patrol") + " deleted";
    } else if (apitype === "delete_raid" && data.has("raid")) {
      let raid = data.get("raid");
      await deleteData("raid", "raid_name", raid);
      await deleteData("raid_list", "raid_user", raid); // raid_list에서도 삭제
      returnData = raid + " deleted";
    } else if (apitype === "delete_raid_list" && data.has("raid")) {
      let raid = data.get("raid_user");
      devLog("delete_raid_list", raid);
      await deleteData("raid_list", "raid_user", raid);
      returnData = raid + " deleted";
    }
    return NextResponse.json({message: "upload And Images uploaded successfully " + returnData});
  } catch (error) {
    return NextResponse.json({message: "delete fail", error: error.message}, {status: 500});
  }
}
