import server from "/scripts/server";
import deleteq from "/scripts/query/delete";
import insertq from "/scripts/query/insert";
import selectq from "/scripts/query/select";
import createq from "/scripts/query/create";
import {devLog} from "/scripts/common";

export default function handler(req, res) {
    let query = req.query;

    if (query.state == "start") {
    }

    res.status(200).text();
}
