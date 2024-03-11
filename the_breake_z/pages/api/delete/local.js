import server from "/scripts/server.js";
import deleteDML from "/scripts/query/delete";
import insertDML from "/scripts/query/insert";

export default async function handler(req, res) {
  let body = JSON.parse(req.body);
  let deleteName = body.name;

  // const insert = require("/scripts/query/insert.js");
  const deleteData = [{name: deleteName}];
  // poketmon 데이터 INSERT
  let deletePrepare = server.db.prepare(deleteDML.delete.local);
  server.sqlite.transaction(deleteData, deletePrepare);

  res.status(200).json({name: "complete"});
}
