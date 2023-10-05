import server from "/scripts/server";
import {devLog} from "/scripts/common";
import insertq from "/scripts/query/insert";
import selectq from "/scripts/query/select";
import deleteq from "/scripts/query/delete";

export {sseInsertMessage, sseGetMessage, sseDeleteMessage};

// 개발모드에선 memdb 초기화로 작동 x
const usedb = process.env.NEXT_PUBLIC_DEV == "dev" ? server.db : server.memdb;

function sseInsertMessage(id, message) {
    if (!usedb) {
        devLog("db가 연결되지 않았습니다.");
        return;
    }
    devLog("*** sseInsertMessage * insert Message id - ", id, ", message - ", message);
    usedb.prepare(insertq.insert.sse).run({name: id, message: message});
    devLog(sseGetMessage());
}
/**
 * @param {string} name
 * @returns {Array | Object}
 */
function sseGetMessage(name = null) {
    let data = null;
    if (name) data = usedb.prepare(selectq.sse.first).get({name: name});
    else data = usedb.prepare(selectq.sse.all).all();
    return data;
}
/**
 *
 * @param {string} name
 * @param {int} id
 */
function sseDeleteMessage(name, id) {
    usedb.prepare(deleteq.delete.sse).run({name: name, id: id});
}
