import server from "/scripts/server";
import deleteq from "/scripts/query/delete";
import insertq from "/scripts/query/insert";
import selectq from "/scripts/query/select";
import createq from "/scripts/query/create";
import {devLog} from "/scripts/common";

export default function handler(req, res) {
    let query = req.query;

    if (query.state == "start") {
        fetch("http://localhost:3000/api/macro/start?state=test").then((res) => {
            devLog("==================================== res : ", res);
        });
    }

    res.status(200).send(`admin page : ${query.state} complete`);
}
