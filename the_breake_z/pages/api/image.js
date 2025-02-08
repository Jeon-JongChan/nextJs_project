// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { devLog } from "/scripts/common";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    try {
        let imageSrc = req.query.src;
        let filePath = path.join(process.cwd() + `/public${imageSrc}`);
        // devLog(`api-image start ${filePath}`);
        let image = fs.createReadStream(filePath);
        // devLog(`api-image end  ${filePath}`, image);
        res.status(200).send(image);
    } catch (e) {
        devLog("api-image error", e);
    }
}
