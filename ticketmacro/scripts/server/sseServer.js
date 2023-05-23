import server from "/scripts/server";
import {devLog} from "/scripts/common";

export {sseInit, sseProgress, sseInsertMessage};
// res와 req를 받고 주기적으로 interval을 통해 데이터를 보내는 함수
// 이때 보낼 메세지는 lowdb의 memdb에 저장되어있는 데이터를 사용한다.
function sseInit(res) {
    res.setHeader("Cache-Control", "no-cache, no-transform"); // nextjs에선 no-transform을 추가해야 sse가 작동함
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.write("event: connected\ndata: Connected to SSE server\n\n");

    return res;
}
/**

 * @param {Request} req 
 * @param {Response} res 
 * @param {string} id
 */
function sseProgress(req, res, id, intervalSecond = 10, event = null) {
    if (!server.memdb) {
        devLog("memdb가 연결되지 않았습니다.");
        return;
    }
    let sseConnectLimit = 0;
    const interval = setInterval(async () => {
        let resWrite;
        let sse = server.memdb.get("sse");
        let data = sse.find({id: id}).value();
        devLog("id", id, "sseProgress", data, "event", event, "remove data");
        // 보낼 데이터가 없다 하더라도 활성화 여부를 체크하는 heartbeat를 보내야함. res 종료 이벤트를 사용시 비활성화 가능
        /*
        if (!data) {
            resWrite = res.write(":ping\n\n");
            // devLog("id", id, "no DATA ", "resWrite", resWrite, "connect", sseConnectLimit);
            sseConnectLimit = sseClose(sseConnectLimit, resWrite, res, interval);
            return;
        }
        */
        // res.write(`event: progress\ndata: ${progress}\n\n`);
        if (!event) resWrite = res.write(`data:${data.message}` + "\n\n");
        else resWrite = res.write(`event: ${event}\ndata: ${data.message}` + "\n\n");

        // sse.remove({id: id}).write();
        sse.find({id: id}).head().unset("[0]").write();
        sseConnectLimit = sseClose(sseConnectLimit, resWrite, res, interval);
    }, intervalSecond * 1000);
    // nextjs에서 req의 end, close는 작동하지 않음
    // 아마도 클라이언트측이 강제 종료된 경우 HTTP 프로토콜이라 close이벤트가 발생하는게 아닌 무한대기 상태가 되어 req가 종료되지 않는 것 같음
    res.socket.on("end", (e) => {
        console.log("event source closed");
        sseClose(3, false, res, interval);
    });
    return [req, res];
}

function sseClose(sseConnectLimit, resWrite, res, interval) {
    if (!resWrite) {
        sseConnectLimit++;
        if (sseConnectLimit > 3) {
            devLog("CLOSED SSE CONNECTION");
            res.end();
            clearInterval(interval);
        }
    } else sseConnectLimit = 0;

    return sseConnectLimit;
}

async function sseInsertMessage(id, message) {
    if (!server.memdb) {
        devLog("memdb가 연결되지 않았습니다.");
        return;
    }
    let sse = server.memdb.get("sse");
    sse.push({id: id, message: message}).write();
    devLog(sse.value());
}
