import server from "/scripts/server";
import {devLog} from "/scripts/common";
import insertQuery from "/scripts/query/insert";

export {sseInsertMessage};

async function sseInsertMessage(id, message) {
    if (!server.memdb) {
        devLog("memdb가 연결되지 않았습니다.");
        return;
    }
    devLog("insert Message id - ", id, ", message - ", message);
    let insertPrepare = server.memdb.prepare(insertQuery.insert.sse);
    insertPrepare.run({name: id, message: message});
}
