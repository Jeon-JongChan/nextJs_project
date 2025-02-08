import {devLog} from "/scripts/common";
export {sseConnect};
function sseConnect(sseId = "test") {
    let source =
        typeof EventSource !== "undefined"
            ? new EventSource(`/api/sse?id=${sseId}`, {
                  header: {
                      "Cache-Control": "no-cache, no-transform",
                      "Accept-Encoding": "identity",
                      "Content-Type": "text/event-stream",
                      Connection: "keep-alive",
                  },
              })
            : null;
    if (source) {
        source.addEventListener("connected", () => {
            console.log("Connected to SSE server");
        });
        // 해당 구문은 변형될 가능성이 많으므로 함수에선 선언해주지 않음
        // source.addEventListener("message", (event) => devLog(`Progress: ${event.data}`));
    } else {
        devLog("EventSource not supported");
    }

    window.onunload = () => {
        devLog("새로고침 합니다 source : ", source);
        if (source) source.close();
    };

    return source;
}
