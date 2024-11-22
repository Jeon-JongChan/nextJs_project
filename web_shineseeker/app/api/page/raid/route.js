import {NextResponse} from "next/server";
import {saveData, getDataKey, updateData, executeSelectQuery, executeQuery} from "@/_custom/scripts/server";
import {devLog} from "@/_custom/scripts/common";
import query from "@/_custom/scripts/sqlite3-query";
// upload에 대한 post 요청을 처리하는 함수
export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const apitype = searchParams.get("apitype");
  const userid = searchParams.get("userid");
  let data = null;
  try {
    if (apitype === "member_skill") {
      data = await executeSelectQuery(query.select.user_skill, [userid]);
    } else if (apitype === "job") {
      // job의 경우 해당하는 skill값을 배열로 추가해줘야함
    }
    return NextResponse.json({message: "successfully api", data: data});
  } catch (error) {
    console.log("GET error", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
export async function POST(req) {
  try {
    let returnData = null;
    const data = await req.formData();
    const apitype = data.get("apitype");
    devLog(data.get("apitype"), data);
    if (apitype === "member_update_skill") {
      const userid = data.get("userid");
      const skillname = JSON.parse(data.get("updated_skill"));
      const savedata = {...skillname};
      devLog("member_update_skill", savedata);
      await updateData("user", "userid", userid, savedata);
    }
    return NextResponse.json({message: "successfully page api", data: returnData});
  } catch (error) {
    return NextResponse.json({message: "upload fail", error: error.message}, {status: 500});
  }
}
