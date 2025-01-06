"use client";
import {useEffect, useRef, useCallback} from "react";
import io from "socket.io-client";
import {devLog} from "@/_custom/scripts/common";

const useSocketClient = ({roomId, username, onMessage = null, onData = null, onChat = null}) => {
  const socketRef = useRef(null); // 소켓 연결 유지
  const responseRef = useRef([]); // 받은 메시지 관리

  // 소켓 초기화
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io();

      socketRef.current.on("receive-message", (data) => {
        devLog("메시지 수신:", data);
        responseRef.current = [...responseRef.current, data];
        if (onMessage) onMessage(data); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("receive-data", (data) => {
        devLog("데이터 수신:", data, data.data);
        let receive = JSON.parse(data.data.data);
        responseRef.current = [...responseRef.current, data];
        if (onData) onData(receive); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("receive-chat", (data) => {
        devLog("채팅 수신:", data);
        responseRef.current = [...responseRef.current, data];
        if (onChat) onChat(data); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("user-list", (userList) => {
        devLog("현재 사용자 목록:", userList);
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
    devLog("방 참여:", roomId, username, socketRef.current);
    if (roomId && username && socketRef.current) {
      devLog("무사통과 방 참여:", roomId, username);
      socketRef.current.emit("join-room", {roomId, username});
    }
  }, [roomId, username]);

  // 메시지 송신
  const sendMessage = useCallback(
    (message) => {
      devLog("메시지 송신:", message, roomId, username, socketRef.current);
      if (message && roomId && username && socketRef.current) {
        socketRef.current.emit("send-message", {roomId, message, username});
      }
    },
    [roomId, username]
  );

  // 메시지 송신
  const sendData = useCallback(
    (data) => {
      devLog("데이터 송신:", data, roomId, username, socketRef.current);
      if (data && roomId && username && socketRef.current) {
        socketRef.current.emit("send-data", {roomId, data: JSON.stringify(data), username});
      }
    },
    [roomId, username]
  );

  // 메시지 송신
  const sendChat = useCallback(
    (chat) => {
      devLog("채팅 송신:", chat, roomId, username, socketRef.current);
      if (chat && roomId && username && socketRef.current) {
        socketRef.current.emit("send-chat", {roomId, chat, username});
      }
    },
    [roomId, username]
  );

  return {joinRoom, sendMessage, sendData, sendChat, socketRef, responseRef};
};

export default useSocketClient;

/* 상위컴포넌트 사용 예시 
const { joinRoom, sendMessage, responseRef } = SocketClient({
    roomId,
    username,
    onMessage: handleIncomingMessage,
  });
*/
