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
    } else if (apitype === "log") {
      const page = searchParams.get("page");
      data = await executeSelectQuery(query.select.log, [userid, page]);
    } else if (apitype === "user_money") {
      data = await executeSelectQuery(query.select.user_money, [userid]);
    } else if (apitype === "user_job") {
      data = await executeSelectQuery(query.select.user_job, [userid]);
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
    if (apitype === "logsave") {
      const logdata = JSON.parse(data.get("log"));
      if (!logdata?.user_name) {
        return NextResponse.json({message: "don't save log", data: logdata});
      }
      devLog("logsave", logdata);
      await saveData("log", logdata);
    } else if (apitype === "member_update_skill") {
      const userid = data.get("userid");
      const skillname = JSON.parse(data.get("updated_skill"));
      const savedata = {...skillname};
      // devLog("member_update_skill", savedata);
      await updateData("user", "userid", userid, savedata);
    } else if (apitype === "member_use_item") {
      const userid = data.get("userid");
      const item_name = data.get("item_name");
      // 사용한 아이템 사용 및 삭제
      const itemInfo = (await executeSelectQuery(query.select.using_item, [userid, item_name]))?.[0];
      const userInfo = await getDataKey("user", "userid", userid);
      // devLog("member_use_item", item_name);
      if (itemInfo && userInfo) {
        if (itemInfo.item_type === "성장재료") {
          const matchStat = {HP: "user_hp", ATK: "user_atk", DEF: "user_def", LUK: "user_luk", AGI: "user_agi", WIS: "user_wis"};
          const itemIncreaseStat = matchStat?.[itemInfo.item_addstat];
          if (!itemIncreaseStat) return NextResponse.json({message: "item stat not match stat", data: itemInfo.item_addstat});
          const minValue = parseInt(itemInfo.item_statmin) || 0;
          const maxValue = parseInt(itemInfo.item_statmax) || 0;
          // min, max 사이의 정수 랜덤값
          const randomValue = (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue) | 0;
          let newStat = userInfo[itemIncreaseStat] + randomValue;
          newStat = newStat > 200 ? 200 : newStat < 0 ? 0 : newStat;
          // devLog(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> member_use_item", itemIncreaseStat, minValue, maxValue, maxValue - minValue + 1, randomValue, newStat);
          if (randomValue) await updateData("user", "userid", userid, {[itemIncreaseStat]: newStat});
          await executeQuery("user", query.delete.user_item_one, [userid, item_name]);
          return NextResponse.json({message: "successfully page api", data: "성장재료 사용 성공"});
        }
      }
    } else if (apitype === "member_skill") {
      const userid = data.get("userid");
      const skillInfo = await executeSelectQuery(query.select.member_skill, [userid]);
      // devLog(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 멤버 스킬반환!", skillInfo);
      returnData = skillInfo;
    } else if (apitype === "market_buy_item") {
      const item_name = data.get("item_name");
      const item_cost = parseInt(data.get("item_cost") || 0);
      const userid = data.get("userid");
      const userMoney = (await executeSelectQuery(query.select.user_money, [userid]))?.[0]?.user_money;
      if (userMoney < item_cost) return NextResponse.json({message: "not enough money", data: userMoney});
      devLog("market_buy_item", item_name, item_cost, userid, userMoney);
      await executeQuery("user", query.update.user_money, [userMoney - item_cost, userid]);
      await saveData("user_item", {userid: userid, item: item_name});
      return NextResponse.json({message: "successfully page api", data: "아이템 구매 성공"});
    } else if (apitype === "member_update_skill_desc") {
      const userid = data.get("userid");
      const skillname = data.get("skill_name");
      const skilldesc = data.get("skill_desc");
      // devLog("member_update_skill_desc", savedata);
      await executeQuery("user_skill", query.update.user_skill, [skilldesc, userid, skillname]);
    }
    return NextResponse.json({message: "successfully page api", data: returnData});
  } catch (error) {
    return NextResponse.json({message: "upload fail", error: error.message}, {status: 500});
  }
}
