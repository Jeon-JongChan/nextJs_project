import server from "/scripts/server";
import {devLog} from "/scripts/common";
import selectq from "/scripts/query/select";

export default function handler(req, res) {
    let param = req.query;
    let id = param.id;
    let query = selectq.api_data?.[id];
    let data = server.db.prepare(query).all();
    devLog("==================================== data query : ", query, data);
    res.status(200).json(data);
}
