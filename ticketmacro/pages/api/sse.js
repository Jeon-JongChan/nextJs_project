import server from "/scripts/server";
import {sseInit, sseProgress, sseInsertMessage} from "/scripts/server/sseServer";
// import crawer from "/scripts/server/crawler";

export default async function handler(req, res) {
    let sseId = req.query.id;

    sseInit(res);
    console.log("sseId", sseId, req.query);
    [req, res] = sseProgress(req, res, sseId, 10);
}
