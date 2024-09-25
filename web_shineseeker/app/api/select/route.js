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
    // devLog("select GET ::::::: ", apitype, data);
    if (data) {
      if (apitype === "user") {
        // user의 경우 item 값을 추가해줘야 함
        for (let i = 0; i < data.length; i++) {
          let items = await getDataKey("items", "userid", data[i].userid, true);
          data[i].items = items.map((item) => item.item);
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
