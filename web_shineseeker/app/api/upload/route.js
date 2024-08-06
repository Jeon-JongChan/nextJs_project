import {NextResponse} from "next/server";
import {saveFiles} from "../../../_custom/scripts/server";

export const POST = async (req) => {
  try {
    const data = await req.formData();
    console.log(data);
    const files = data.getAll("file");

    if (files.length === 0 || files.some((file) => file.type.split("/")[0] !== "image")) {
      return NextResponse.json({error: "One or more files are not images"}, {status: 400});
    }

    const filePaths = await saveFiles(files);

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
