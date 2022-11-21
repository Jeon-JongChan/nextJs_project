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
        // form.on("file", function (field, file) {
        //     console.log("form.on(file ", file.filepath, " next :", form.uploadDir + "\\" + file.originalFilename);
        //     fs.rename(file.filepath, form.uploadDir + "/" + file.originalFilename, () => console.log("readFile - Succesfully rename to " + form.uploadDir + "/" + file.name));
        // });
    }
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            let fileName = files.image.originalFilename.split(".");
            fs.rename(files.image.filepath, form.uploadDir + "/" + +fields.name + "." + fileName[fileName.length - 1], () =>
                console.log("readFile - Succesfully rename to " + form.uploadDir + "/" + files.image.name)
            );

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
    const insertSpecData = [{ NAME: resData.spec1 }, { NAME: resData.spec2 }, { NAME: resData.spec3 }];

    let upsertPrepare = server.db.prepare(insert.upsert_poketmon);
    server.sqlite.transaction(insertPoketmonData, upsertPrepare);

    res.status(200).json({ name: "John Doe" });
}
