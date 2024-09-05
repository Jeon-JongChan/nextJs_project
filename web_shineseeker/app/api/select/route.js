import {NextResponse} from "next/server";
import {getData, saveData} from "@/_custom/scripts/server";
import {devLog} from "@/_custom/scripts/common";
// upload에 대한 post 요청을 처리하는 함수
export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const apitype = searchParams.get("apitype");
  const getcount = searchParams.get("getcount");
  try {
    // devLog("GET", searchParams, apitype, getcount);
    if (getcount == 1) {
      // 최초요청일 경우 데이터 바로전송
      const data = await getData(apitype);
      // devLog("GET first Call", data);
      if (data) return NextResponse.json({message: "successfully api", data: data});
    } else {
      // 데이터 전송량을 줄이기 위해 최초가 아닐경우 1분이내 업데이트된 데이터만 전송
      const data = await getData(apitype, 60);
      if (data) return NextResponse.json({message: "successfully api", data: data});
    }
    return NextResponse.json({message: "successfully api but no data", data: null});
  } catch (error) {
    console.log("GET error", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we are handling it ourselves
  },
};
