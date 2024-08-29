import {promises as fs} from "fs";
import path from "path";
import jsondb from "./jsondb.js";

export {saveFiles, saveData, deleteData, getData};

async function saveFiles(files, uploadDir = undefined) {
  try {
    if (!uploadDir) {
      uploadDir = path.join(process.cwd(), "public/temp", "uploads");
    }
    uploadDir = path.join(process.cwd(), "public/temp", "uploads");
    await fs.mkdir(uploadDir, {recursive: true});

    const fileUploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
      await fs.writeFile(filePath, buffer);
      return filePath;
    });
    return await Promise.all(fileUploadPromises); // 모든 파일 업로드 작업이 완료될 때까지 대기하고, 완료되면 파일 경로들의 배열을 반환
  } catch (e) {
    console.error("server.js saveFiles Function : ", e);
    return [];
  }
}

async function saveData(key, data) {
  jsondb.updateObject(key, data);
}

async function deleteData(key) {
  jsondb.deleteObject(key);
}

async function getData(key) {
  jsondb.readObject(key);
}
