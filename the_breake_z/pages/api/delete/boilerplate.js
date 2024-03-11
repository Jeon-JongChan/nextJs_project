import server from "/scripts/server.js";
import deleteDML from "/scripts/query/delete";
import insertDML from "/scripts/query/insert";

export default async function handler(req, res) {
  let body = JSON.parse(req.body);
  let deleteName = body.name;
  let deleteKey = body.name ? body.name : "unkown";

  // const insert = require("/scripts/query/insert.js");
  const deleteData = [{name: deleteName}];
  // poketmon 데이터 INSERT
  let deletePrepare = server.db.prepare(deleteDML.delete.boilerplate);
  server.sqlite.transaction(deleteData, deletePrepare);
  // 삭제 작업자 작업 저장
  let insertData = [{key: deleteKey, job: "상용구delete"}];

  res.status(200).json({name: "complete"});
}
// jamx2ee123!
