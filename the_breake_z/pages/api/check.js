// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import server from "/scripts/server";
import fs from "fs";

export default function handler(req, res) {
    let ret = server.db.prepare("select count(*) from sqlite_master").get();
    console.log(ret);
    res.status(200).json(ret);
}
