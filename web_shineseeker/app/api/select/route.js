import {NextResponse} from "next/server";
import {getData, saveData, getDataKey} from "@/_custom/scripts/server";
import {devLog} from "@/_custom/scripts/common";
// upload에 대한 post 요청을 처리하는 함수
export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const apitype = searchParams.get("apitype");
  const getcount = searchParams.get("getcount");
  const apioption = searchParams.get("apioption");

  try {
    let data = await getData(apitype, getcount == 1 ? 0 : 60, true);
    // devLog(`select ${getcount} 번째 GET ::::::: `, searchParams, apitype, data);
    if (data) {
      if (apitype === "user") {
        // user의 경우 item, role 값을 추가해줘야 함
        for (let i = 0; i < data.length; i++) {
          // userid가 shineseekeradmin 인 경우 삭제
          if (data[i].userid === "shineseekeradmin" && apioption !== "admin") {
            data.splice(i, 1);
            continue;
          }
          let items = await getDataKey("user_item", "userid", data[i].userid, true);
          if (items?.length) data[i].items = items.map((item) => item.item);
          let role = await getDataKey("user_auth", "userid", data[i].userid);
          if (role?.userpw) {
            data[i].userpw = role.userpw;
            data[i].role = role.role;
          }
        }
        // userid가 존재하는 경우 해당 값만 보내도록 한다
        let userid = searchParams.get("userid") || null;
        if (userid) data = data.filter((user) => user.userid === userid);
      } else if (apitype === "job") {
        // job의 경우 해당하는 skill값을 배열로 추가해줘야함
        let skills = await getData("job_skill", 0);
        if (skills) {
          for (let i = 0; i < data.length; i++) {
            data[i].job_skill = skills.filter((skill) => skill.job_name === data[i].job_name).map((skill) => skill.skill);
          }
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
      } else if (apitype === "patrol") {
        // patrol의 경우 해당하는 선택지와 결과값을 배열로 추가해줘야함
        for (let i = 0; i < data.length; i++) {
          let patrol_result = await getDataKey("patrol_result", "patrol_name", data[i].patrol_name, true);
          patrol_result.forEach((result) => {
            for (let key in result) {
              if (key === "patrol_ret_idx" || key === "patrol_name") continue;
              else data[i][`${key}_${result.patrol_ret_idx}`] = result[key];
            }
          });
        }
      } else if (apitype === "page") {
        // page의 경우 각 탭별로 데이터를 보내줌
        const pagename = searchParams.get("pagename");
        let returndata = data.filter((page) => page.page_name === pagename);
        data = returndata;
        //data.forEach((page) => {if (page.id.startsWith(`${pagename}_img`)) page.value = "/temp/upload/" + page.value}); // 이미지 경로 추가
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
