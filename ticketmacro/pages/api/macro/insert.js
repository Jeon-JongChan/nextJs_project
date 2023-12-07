import server from "/scripts/server";
import insertq from "/scripts/query/insert";
import {devLog} from "/scripts/common";
import {sseInsertMessage, sseGetMessage} from "/scripts/server/sseServer";

export default async function handler(req, res) {
    // 클라이언트로 보낼 메시지
    const message = "SSE 테스트";
    let sseId = req.query.id;

    devLog("macro insert data : ", req.query, req.body, sseId);
    // 매크로 데이터 저장
    server.db.prepare(insertq.insert.macro).run({
        sse: sseId,
        site: req.body.site,
        ticketdate: req.body.ticketdate,
        start_dt: req.body.datetime,
        url: req.body.url,
    });
    // SSE 메세지 insert
    sseInsertMessage(sseId, `매크로를 작업을 저장합니다. SITE : ${req.body.site} URL : ${req.body.url}`);

    // API 응답
    res.status(200).json({message: "매크로 데이터 저장"});
}
