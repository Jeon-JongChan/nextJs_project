import {NextResponse} from "next/server";
import {saveData, executeSelectQuery, executeQuery, updateTableTime} from "@/_custom/scripts/server";
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
    if (apitype === "create_raid") {
      const userid = data.get("userid");
      const raidName = data.get("raid_name");
      const raidHeadcount = data.get("raid_headcount");

      // 1. 해당 유저가 이미 raid를 생성했는지 확인
      const raidUserCheck = await executeSelectQuery(query.select.raid_user, [userid, userid]);
      if (raidUserCheck?.[0]?.isreader || raidUserCheck?.[0]?.isuser) {
        return NextResponse.json({message: "이미 레이드를 생성한 유저입니다."}, {status: 400});
      }
      // 2. raid 생성
      const raidData = await executeQuery("raid", query.update.raid_create, [userid, raidHeadcount, raidName]);
      devLog("create_raid", userid, raidName, raidHeadcount, raidData);
      // 3. raid_list에 생성한 reader 추가
      if (raidData?.changes) await saveData("raid_list", {raid_name: raidName, raid_user: userid, raid_order: 1});
      else return NextResponse.json({error: "레이드 생성에 실패했습니다."}, {status: 400});
      returnData = raidName + " 생성 완료";
      return NextResponse.json({message: returnData});
    } else if (apitype === "modify_raid") {
      const userid = data.get("userid");
      const raidName = data.get("raid_name");
      const raidOrders = JSON.parse(data.get("raid_orders"));
      devLog("modify_raid", raidName, raidOrders);

      // 1. 해당 유저가 raid를 생성한 유저인지 확인
      const raidUserCheck = await executeSelectQuery(query.select.raid_create_user, [raidName, userid]);
      if (!raidUserCheck?.[0]?.isreader) {
        return NextResponse.json({message: "레이드 생성자가 아닙니다."}, {status: 400});
      }
      // 2. raidOrders에 raid_name 추가
      for (let i = 0; i < raidOrders.length; i++) {
        raidOrders[i].raid_name = raidName;
      }
      // 3. raid_list에 생성한 reader 추가 ( raid_list 초기화 후 재입력)
      await executeQuery("raid", query.delete.raid_list, [raidName]);
      await saveData("raid_list", raidOrders, true);
      returnData = raidName + " 수정 완료";
    } else if (apitype === "join_raid") {
      const userid = data.get("userid");
      const raidName = data.get("raid_name");

      // 1. 해당 유저가 이미 raid에 참여했는지 확인
      const raidUserCheck = await executeSelectQuery(query.select.raid_user, [userid, userid]);
      if (raidUserCheck?.[0]?.isreader || raidUserCheck?.[0]?.isuser) {
        return NextResponse.json({message: "이미 레이드에 참여한 유저입니다."}, {status: 400});
      }
      // 2. raid_list에 유저 추가
      let lastOrder = 0;
      const orderData = (await executeSelectQuery(query.select.raid_last_order, [raidName]))[0];
      devLog("join_raid", raidName, orderData, orderData.last_order + 1, orderData.total_user >= orderData.last_order + 1);
      if (!orderData) {
        return NextResponse.json({message: "해당 레이드가 존재하지 않습니다."}, {status: 400});
      } else if (orderData.total_user < orderData.last_order + 1) {
        return NextResponse.json({message: "레이드 순서가 이상합니다"}, {status: 400});
      } else {
        lastOrder = (orderData?.last_order || 0) + 1;
      }
      await saveData("raid_list", {raid_name: raidName, raid_user: userid, raid_order: lastOrder});
      await updateTableTime("raid");
      returnData = raidName + " 참여 완료";
      return NextResponse.json({message: returnData});
    } else if (apitype === "exit_raid") {
      const userid = data.get("userid");
      const raidName = data.get("raid_name");
      // 1. 해당 유저가 삭제할려는 레이드에 리더인지 확인
      const raidUserCheck = await executeSelectQuery(query.select.raid_user, [userid, userid]);

      // 2. 리더일 경우 레이드 전체 삭제
      if (raidUserCheck?.[0]?.isreader) {
        await executeQuery("raid", query.delete.raid_list, [raidName]);
        await executeQuery("raid", query.update.raid_init, [raidName]);
        returnData = raidName + " 삭제 완료";
      } else if (raidUserCheck?.[0]?.isuser) {
        // 3. 리더가 아닐 경우 해당 유저만 삭제
        await executeQuery("raid", query.delete.raid_list_user, [raidName, userid]);
        returnData = raidName + " 나가기 완료";
      } else {
        return NextResponse.json({message: "레이드에 참여하지 않은 유저입니다."}, {status: 400});
      }
      return NextResponse.json({message: returnData});
    }
    return NextResponse.json({message: "successfully page api", data: returnData});
  } catch (error) {
    devLog("POST error", error);
    return NextResponse.json({message: "upload fail", error: error.message}, {status: 500});
  }
}
