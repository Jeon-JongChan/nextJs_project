import {NextResponse} from "next/server";
import {saveFiles} from "../../../_custom/scripts/server";
// upload에 대한 post 요청을 처리하는 함수
export const POST = async (req) => {
  try {
    const data = await req.formData();
    const apitype = data.get("apitype");
    console.log(data.get("apitype"), data);
    if (apitype === "update_user") {
      update_user(data);
      return NextResponse.json({message: "User And Images uploaded successfully", filePaths});
    }

    return NextResponse.json({message: "Files uploaded successfully", filePaths});
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we are handling it ourselves
  },
};
// --------------- 아래는 upload 요청 중 api type에 따른 함수리스트
async function update_user(data) {
  const user = {
    id: data.get("userid"),
    pw: data.get("userpw"),
    name: data.get("username"),
    profile: data.get("profill"),
    job: data.get("job"),
    level: data.get("level"),
    stat: data.get("stat"),
    skill: data.get("skill"),
    money: data.get("money"),
  };
  const files = data.getAll("file");
  if (files.length === 0 || files.some((file) => file.type.split("/")[0] !== "image")) {
    return NextResponse.json({error: "One or more files are not images"}, {status: 400});
  }

  const imagePaths = await saveFiles(files);
  return imagePaths;
}
