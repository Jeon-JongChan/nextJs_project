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
    if (apitype === "patrol_item") {
      data = await executeSelectQuery(query.select.patrol_item, []);
    } else if (apitype === "patrol_user") {
      data = await executeSelectQuery(query.select.user_patrol, [userid]);
    }
    return NextResponse.json({message: "successfully api", data: data});
  } catch (error) {
    console.error("GET error", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
export async function POST(req) {
  try {
    let returnData = null;
    const data = await req.formData();
    const apitype = data.get("apitype");
    devLog(data.get("apitype"), data);
    if (apitype === "patrol_result") {
      const userid = data.get("userid");
      let stamina = parseInt(data.get("stamina"));
      stamina = stamina < 0 ? 0 : stamina % 6;
      const result = JSON.parse(data.get("result"));
      if (result.type === "AKA") {
        await executeQuery(query.update.user_patrol_result, [stamina, result.value, userid]);
      } else {
        await executeQuery(query.update.user_stamina, [stamina, userid]);
        const count = parseInt(result.value);
        if (count && result.value >= 0) {
          await saveData("user_item", Array(count).fill({userid: userid, item: result.type}), true);
        }
      }
      // devLog(`${apitype} : `, userid, stamina, result);
    }
    return NextResponse.json({message: "successfully page api", data: returnData});
  } catch (error) {
    return NextResponse.json({message: "upload fail", error: error.message}, {status: 500});
  }
}
