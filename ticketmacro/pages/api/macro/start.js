import server from "/scripts/server";
import {devLog} from "/scripts/common";
import {sseInsertMessage} from "/scripts/server/sseServer";

export default async function handler(req, res) {
    // 클라이언트로 보낼 메시지
    const message = "SSE 테스트";
    const sseId = req.query.id;

    devLog(" start api : ", req.query, req.body, sseId);

    // SSE 메세지 insert
    sseInsertMessage(sseId, message + "0");
    sseInsertMessage(sseId, message + "1");
    sseInsertMessage(sseId, message + "2");

    // API 응답
    res.status(200).json({message: "매크로테스트 시작"});
}
