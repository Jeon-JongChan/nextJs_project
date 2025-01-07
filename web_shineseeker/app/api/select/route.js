import {NextResponse} from "next/server";
import {getData, getDataKeyTimeCheck, getDataKey, executeSelectQuery} from "@/_custom/scripts/server";
import query from "@/_custom/scripts/sqlite3-query";
import {devLog} from "@/_custom/scripts/common";
// upload에 대한 post 요청을 처리하는 함수
export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const apitype = searchParams.get("apitype");
  const getcount = searchParams.get("getcount");
  const apioption = searchParams.get("apioption");

  try {
    let data = null;
    if (apioption === "one_user") {
      let userid = searchParams.get("userid");
      data = await getDataKeyTimeCheck(apitype, "userid", userid, getcount == "1" ? 0 : 15, true);
    } else data = await getData(apitype, getcount == 1 ? 0 : 15, true, {order: 1});
    // devLog(`select ${getcount} 번째 GET ::::::: `, searchParams, apitype, data);
    if (data) {
      if (apitype === "user") {
        // user_name 별 userid별로 정렬 data = data.sort((a, b) => a.userid.localeCompare(b.userid));
        // user의 경우 item, role 값을 추가해줘야 함
        let users = [];
        for (let i = 0; i < data.length; i++) {
          // userid가 shineseekeradmin 인 경우 삭제
          if (data[i].userid === "shineseekeradmin" && apioption === "notadmin") {
            // data.splice(i, 1);
            continue;
          }
          // 유저별 아이템 추가
          let items = await getDataKey("user_item", "userid", data[i].userid, true);
          if (items?.length) data[i].items = items.map((item) => item.item);
          // 유저 메일이 있는 경우 아이템 규격에 맞게 메일을 추가
          let mails = await executeSelectQuery(query.select.user_mail, [data[i].userid]);
          if (mails?.length) data[i].mails = mails;

          if (apioption === "admin") {
            let role = await getDataKey("user_auth", "userid", data[i].userid);
            if (role?.userpw) {
              data[i].userpw = role.userpw;
              data[i].role = role.role;
            }
          }
          // 유저별 스킬 목록 전부 추가
          // let skill = await getDataKey("user_skill", "userid", data[i].userid, true, {order: 2});
          let skill = await executeSelectQuery(query.select.user_skill, [data[i].userid]);
          if (skill?.length)
            data[i].skills = skill.map((skill) => ({
              name: skill.skill_name,
              desc: skill.user_skill_desc || skill.skill_desc,
            }));

          // apioption이 admin인경우 log도 추가
          if (apioption === "admin") {
            let logs = await getDataKey("log", "user_name", data[i].userid, true);
            if (logs?.length) data[i].logs = logs;
          }
          users.push(data[i]);
        }
        // userid가 존재하는 경우 해당 값만 보내도록 한다
        data = users;
        let userid = searchParams.get("userid") || null;
        if (userid) data = data.filter((user) => user.userid === userid);
      } else if (apitype === "job") {
        // job의 경우 해당하는 skill값을 배열로 추가해줘야함
        let skills = await getData("job_skill", 0);
        if (skills) {
          for (let i = 0; i < data.length; i++) {
            data[i].job_skill = skills.filter((skill) => skill.job_name === data[i].job_name).map((skill) => skill.skill_name);
          }
        }
      } else if (apitype === "monster") {
        // monster의 경우 해당하는 monster_event값을 배열로 추가해줘야함
        for (let i = 0; i < data.length; i++) {
          let monster_events = await getDataKey("monster_event", "monster_name", data[i].monster_name, true);
          if (monster_events?.length) {
            monster_events.forEach((event) => {
              for (let key in event) {
                if (key === "monster_event_idx" || key === "monster_name") continue;
                else data[i][`${key}_${event.monster_event_idx}`] = event[key];
              }
            });
          }
        }
      } else if (apitype === "patrol") {
        // monster의 경우 해당하는 monster_event값을 배열로 추가해줘야함
        for (let i = 0; i < data.length; i++) {
          let choices = await getDataKey("patrol_result", "patrol_name", data[i].patrol_name, true);
          if (choices.length) {
            data[i].choices = {};
            choices.forEach((choice) => {
              data[i].choices[choice.patrol_ret_idx] = choice;
            });
          }
        }
      } else if (apitype === "raid") {
        // raid의 경우 해당하는 raid_userlist값을 배열로 추가해줘야함
        for (let i = 0; i < data.length; i++) {
          let raid_userlist = await getDataKey("raid_list", "raid_name", data[i].raid_name, true, {order: "raid_order, raid_user"});
          if (raid_userlist?.length) {
            data[i].userlist = raid_userlist;
          }
        }
      } else if (apitype === "skill") {
        // skill의 경우 해당하는 skill_operator값을 배열로 추가해줘야함
        for (let i = 0; i < data.length; i++) {
          let operators = await getDataKey("skill_operator", "skill_name", data[i].skill_name, true, {order: "skill_operator_order"});
          if (operators) {
            // skill_operator_order를 key로 가진 객체의 배열을 생성하여 추가
            let temp = {};
            operators.forEach((operator) => {
              temp[operator.skill_operator_order] = operator;
            });
            data[i].operators = temp;
          }
        }
      } else if (apitype === "page") {
        // page의 경우 각 탭별로 데이터를 보내줌
        const pagename = searchParams.get("pagename");
        let returndata = data.filter((page) => page.page_name === pagename);
        if (pagename === "main") {
          let patrol = data.filter((page) => page.page_name === "battle" && page.id === "battle_active_status_patrol");
          if (patrol?.[0]) returndata.push(patrol[0]);
        }
        data = returndata;
        //data.forEach((page) => {if (page.id.startsWith(`${pagename}_img`)) page.value = "/temp/upload/" + page.value}); // 이미지 경로 추가
      }
      return NextResponse.json({message: "successfully api", data: data});
    }
    return NextResponse.json({message: "successfully api but no data", data: null});
  } catch (error) {
    console.error("GET error", error);
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
