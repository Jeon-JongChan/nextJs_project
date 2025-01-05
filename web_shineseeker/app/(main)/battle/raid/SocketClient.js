import {useEffect, useRef, useCallback} from "react";
import io from "socket.io-client";

const SocketClient = ({onMessage, roomId, username}) => {
  const socketRef = useRef(null); // 소켓 연결 유지
  const responseRef = useRef([]); // 받은 메시지 관리

  // 소켓 초기화
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("/", {path: "/api/socket"});

      socketRef.current.on("receive-message", (data) => {
        responseRef.current = [...responseRef.current, data];
        if (onMessage) onMessage(data); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("user-list", (userList) => {
        console.log("현재 사용자 목록:", userList);
      });

      socketRef.current.on("room-full", () => {
        alert("해당 방은 정원이 가득 찼습니다!");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onMessage]);

  // 방 참여 (roomId, username)
  const joinRoom = useCallback(() => {
    if (roomId && username && socketRef.current) {
      socketRef.current.emit("join-room", {roomId, username});
    }
  }, [roomId, username]);

  // 메시지 송신
  const sendMessage = useCallback(
    (message) => {
      if (message && roomId && username && socketRef.current) {
        socketRef.current.emit("send-message", {roomId, message, username});
      }
    },
    [roomId, username]
  );

  return {joinRoom, sendMessage, responseRef};
};

export default SocketClient;

/* 상위 컴포넌트에서 사용 예시
const socketClientRef = useRef(null); // SocketClient의 메서드 및 데이터 접근

useEffect(() => {
socketClientRef.current = SocketClient({
    onMessage: handleIncomingMessage,
    roomId,
    username,
});
}, [roomId, username]);


*/
