import {Server} from "socket.io";

// 방 관리용 객체
const rooms = {};

/**
 * 사용자를 방에 추가
 * @param {string} roomId
 * @param {string} username
 */
const addUserToRoom = (roomId, username) => {
  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }
  if (rooms[roomId].length < 6) {
    rooms[roomId].push(username);
    return true;
  }
  return false;
};

/**
 * 방에서 사용자 제거
 * @param {string} roomId
 * @param {string} username
 */
const removeUserFromRoom = (roomId, username) => {
  if (rooms[roomId]) {
    rooms[roomId] = rooms[roomId].filter((user) => user !== username);
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }
  }
};

/**
 * 방에 있는 사용자 목록 반환
 * @param {string} roomId
 */
const getUsersInRoom = (roomId) => {
  return rooms[roomId] || [];
};

// 기본적으로 Next.js의 socket은 서버리스 환경에서는 `server` 객체에만 존재하므로, 소켓 서버가 없으면 생성해줍니다.
export async function GET(req, res) {
  if (!res.socket) {
    console.error("소켓 객체가 없습니다. 서버 설정을 확인하세요.", req.socket);
    res.status(500).end("소켓 객체를 찾을 수 없습니다.");
    return;
  }

  // 기존에 소켓 서버가 초기화되어 있지 않으면 초기화합니다.
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*", // 모든 도메인에서 접근 가능
      },
    });

    res.socket.server.io = io;
    console.log("소켓 서버가 초기화되었습니다.");

    io.on("connection", (socket) => {
      console.log("클라이언트 연결됨:", socket.id);

      // 방에 참가하는 이벤트
      socket.on("join-room", ({roomId, username}) => {
        if (!addUserToRoom(roomId, username)) {
          socket.emit("room-full");
          return;
        }

        socket.join(roomId); // 사용자를 해당 방에 참가시키기
        console.log(`${username} 님이 방 ${roomId}에 참가`);

        // 방에 있는 사용자 목록을 클라이언트에게 전달
        io.to(roomId).emit("user-list", getUsersInRoom(roomId));
        socket.to(roomId).emit("receive-message", {
          username: "System",
          message: `${username} 님이 입장했습니다.`,
        });

        // 클라이언트가 연결을 끊으면 방에서 해당 사용자를 제거
        socket.on("disconnect", () => {
          removeUserFromRoom(roomId, username);
          io.to(roomId).emit("user-list", getUsersInRoom(roomId));
          io.to(roomId).emit("receive-message", {
            username: "System",
            message: `${username} 님이 퇴장했습니다.`,
          });
          console.log(`${username} 님이 방 ${roomId}에서 나갔습니다.`);
        });
      });

      // 메시지 전송 이벤트
      socket.on("send-message", ({roomId, message, username}) => {
        console.log(`[${roomId}] ${username}: ${message}`);
        io.to(roomId).emit("receive-message", {username, message});
      });
    });
  } else {
    console.log("소켓 서버는 이미 초기화되었습니다.");
  }

  res.end(); // 응답 종료
}
