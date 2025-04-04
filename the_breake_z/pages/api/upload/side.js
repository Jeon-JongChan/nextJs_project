import server from "/scripts/server.js";
import insert from "/scripts/query/insert";
import {devLog} from "/scripts/common";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  devLog("local api");
  let resData = await server.readAndSaveFileFromFormdata(req, true);
  devLog("side.js resData: ", resData);
  try {
    if (!resData.name) {
      res.status(200).json({status: false, message: "name is null"});
      return null;
    }
    const insertLocalData = [{name: resData.name, text: resData.text}];
    let insertPrepare = server.db.prepare(insert.upsert.side);
    server.sqlite.transaction(insertLocalData, insertPrepare);
  } catch (e) {
    res.status(500).json({status: false, message: e.message});
    return null;
  }
  res.status(200).json({status: true});
}
