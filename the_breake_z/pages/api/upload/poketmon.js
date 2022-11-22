import server from "/scripts/server.js";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
// import insert from "/scripts/query/insert.js";

export const config = {
    api: {
        bodyParser: false,
    },
};

const readAndSaveFileFromFormdata = (req, saveLocally) => {
    // form.uploadDir = "./public/temp/images/";
    const form = new formidable.IncomingForm();
    if (saveLocally) {
        form.uploadDir = path.join(process.cwd(), "/public/temp/images");
        form.keepExtensions = true;
    }
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            let fileName = files.image.originalFilename.split(".");
            let newFileName = fields.name + "." + fileName[fileName.length - 1];
            fs.rename(files.image.filepath, form.uploadDir + "\\" + newFileName, () => console.log("readFile - Succesfully rename to " + form.uploadDir + "/" + files.image.name));
            fields.image = "/temp/images/" + newFileName;

            if (err) reject(err);
            resolve(fields);
        });
    });
};

export default async function handler(req, res) {
    console.log(req.body);
    // server.file.save()
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/temp/images"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/temp/images"));
    }

    let resData = await readAndSaveFileFromFormdata(req, true);
    console.log(resData);

    const insert = require("/scripts/query/insert.js");
    const insertPoketmonData = [{ name: resData.name, rare: resData.rare, level_max: resData.levelmax, level_min: resData.levelmin }];
    const insertPoketmonLocalData = [{ poketmon_name: resData.name, local_name: resData.local }];
    const insertPoketmonSpecData = [
        { poketmon_name: resData.name, spec_name: resData.spec1, priority: 1 },
        { poketmon_name: resData.name, spec_name: resData.spec2, priority: 2 },
        { poketmon_name: resData.name, spec_name: resData.spec3, priority: 3 },
    ];
    const insertImage = [{ path: resData.image }];
    const insertPoketmonImage = [{ poketmon_name: resData.name, image_path: resData.image }];
    // poketmon 데이터 INSERT
    let upsertPrepare = server.db.prepare(insert.upsert_poketmon);
    server.sqlite.transaction(insertPoketmonData, upsertPrepare);
    // poketmon-local 데이터 INSERT
    upsertPrepare = server.db.prepare(insert.ignore_poketmon_local);
    server.sqlite.transaction(insertPoketmonLocalData, upsertPrepare);
    // poketmon-spec 데이터 INSERT
    upsertPrepare = server.db.prepare(insert.ignore_poketmon_spec);
    server.sqlite.transaction(insertPoketmonSpecData, upsertPrepare);
    // image 데이터 INSERT
    upsertPrepare = server.db.prepare(insert.ignore_image);
    server.sqlite.transaction(insertImage, upsertPrepare);
    // image 데이터 INSERT
    upsertPrepare = server.db.prepare(insert.ignore_image);
    server.sqlite.transaction(insertImage, upsertPrepare);

    res.status(200).json({ name: "John Doe" });
}
