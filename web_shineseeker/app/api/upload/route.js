import {NextResponse} from "next/server";
import {promises as fs} from "fs";
import path from "path";

export const POST = async (req) => {
  try {
    const data = await req.formData();
    console.log(data);
    const files = data.getAll("file");

    if (files.length === 0 || files.some((file) => file.type.split("/")[0] !== "image")) {
      return NextResponse.json({error: "One or more files are not images"}, {status: 400});
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, {recursive: true});

    const fileUploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
      await fs.writeFile(filePath, buffer);
      return filePath;
    });

    const filePaths = await Promise.all(fileUploadPromises);

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
