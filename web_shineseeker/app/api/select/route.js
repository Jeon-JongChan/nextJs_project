import {NextResponse} from "next/server";
import {getData, saveData, getDataKey} from "@/_custom/scripts/server";
import {devLog} from "@/_custom/scripts/common";
// upload에 대한 post 요청을 처리하는 함수
export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const apitype = searchParams.get("apitype");
  const getcount = searchParams.get("getcount");
  try {
    const data = await getData(apitype, getcount == 1 ? 0 : 60);
    devLog(`select ${getcount} 번째 GET ::::::: `, searchParams, apitype, data);
    if (data) {
      if (apitype === "user") {
        // user의 경우 item 값을 추가해줘야 함
        for (let i = 0; i < data.length; i++) {
          let items = await getDataKey("items", "userid", data[i].userid, true);
          data[i].items = items.map((item) => item.item);
        }
      } else if (apitype === "job") {
        // job의 경우 해당하는 skill값을 배열로 추가해줘야함
        let skills = await getData("job_skill", 0);
        for (let i = 0; i < data.length; i++) {
          data[i].job_skill = skills.filter((skill) => skill.job_name === data[i].job_name).map((skill) => skill.skill);
        }
      } else if (apitype === "monster") {
        // monster의 경우 해당하는 monster_event값을 배열로 추가해줘야함
        for (let i = 0; i < data.length; i++) {
          let monster_events = await getDataKey("monster_event", "monster_name", data[i].monster_name, true);
          monster_events.forEach((event) => {
            for (let key in event) {
              if (key === "monster_event_idx" || key === "monster_name") continue;
              else data[i][`${key}_${event.monster_event_idx}`] = event[key];
            }
          });
        }
      }
      return NextResponse.json({message: "successfully api", data: data});
    }
    return NextResponse.json({message: "successfully api but no data", data: null});
  } catch (error) {
    console.log("GET error", error);
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
