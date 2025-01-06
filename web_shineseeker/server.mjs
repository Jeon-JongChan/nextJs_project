import http from "http";
import next from "next";
import {Server} from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = http.createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // 모든 도메인에서 접근 가능
    },
  });
  io.on("connection", (socket) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 클라이언트 연결됨:", socket.id);

    // 방에 참가하는 이벤트
    socket.on("join-room", (roomId) => {
      socket.join(roomId.roomId);
      console.log(`클라이언트 ${socket.id}이(가) 방 ${roomId.roomId}에 참가했습니다.`);

      // 방에 메시지 전송
      socket.on("send-message", (data) => {
        let roomId = data.roomId;
        io.to(roomId).emit("receive-message", {
          sender: socket.id,
          message: data,
        });
        // console.log(`메시지 전송: [방 ${message.roomId}] ${socket.id}: 'message);
      });

      // 방에 데이터 전송
      socket.on("send-data", (data) => {
        let roomId = data.roomId;
        io.to(roomId).emit("receive-data", {
          sender: socket.id,
          data: data,
        });
        // console.log(`데이터 전송: [방 ${data.roomId}] ${socket.id}:`, data);
      });

      // 방에 채팅 전송
      socket.on("send-chat", (data) => {
        let roomId = data.roomId;
        io.to(roomId).emit("receive-chat", {
          sender: socket.id,
          chat: data,
        });
        // console.log(`데이터 전송: [방 ${chat.roomId}] ${socket.id}: 'chat);
      });

      // 클라이언트가 연결을 끊으면 방에서 나가기
      socket.on("disconnect", () => {
        console.log(`클라이언트 ${socket.id}이(가) 연결을 끊었습니다.`);
      });
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
