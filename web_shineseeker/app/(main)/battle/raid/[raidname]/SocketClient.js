"use client";
import {useEffect, useRef, useCallback} from "react";
import io from "socket.io-client";
import {devLog} from "@/_custom/scripts/common";

const useSocketClient = ({roomId, username, onMessage = null, onInitSync = null, onData = null, onChat = null}) => {
  const socketRef = useRef(null); // 소켓 연결 유지
  const responseRef = useRef([]); // 받은 메시지 관리

  const addResponse = useCallback((data) => {
    responseRef.current = [...responseRef.current, {data: data, read: false}];
  });

  // 소켓 초기화
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io();

      socketRef.current.on("receive-message", (data) => {
        // devLog("메시지 수신:", data);
        // responseRef.current = [...responseRef.current, data];
        addResponse(data);
        if (onMessage) onMessage(data); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("receive-data", (data) => {
        // devLog("데이터 수신:", data, data.data);
        let receive = JSON.parse(data.data.data);
        addResponse(data);
        if (onData) onData(receive); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("receive-calc", (data) => {
        let receive = JSON.parse(data.data.data);
        // devLog("계산 데이터 수신:", data, receive);
        addResponse(data);
        if (onData) onData(receive, "calc"); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("receive-chat", (data) => {
        // devLog("채팅 수신:", data);
        addResponse(data);
        if (onChat) onChat(data); // 상위 컴포넌트로 응답 전달
      });

      socketRef.current.on("receive-join", (data) => {
        devLog("소켓 서버에 접속 완료:", data);
        addResponse(data);
        if (onInitSync) onInitSync(data); // 상위 컴포넌트로 응답 전달
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
      // devLog("메시지 송신:", message, roomId, username, socketRef.current);
      if (message && roomId && username && socketRef.current) {
        socketRef.current.emit("send-message", {roomId, message, username});
      }
    },
    [roomId, username]
  );

  // 메시지 송신
  const sendData = useCallback(
    (data) => {
      // devLog("데이터 송신:", data, roomId, username, socketRef.current);
      if (data && roomId && username && socketRef.current) {
        socketRef.current.emit("send-data", {roomId, data: JSON.stringify(data), username});
      }
    },
    [roomId, username]
  );
  // 메시지 송신
  const sendCalc = useCallback(
    (data) => {
      // devLog("계산 데이터 송신:", data, roomId, username, socketRef.current);
      if (data && roomId && username && socketRef.current) {
        socketRef.current.emit("send-calc", {roomId, data: JSON.stringify(data), username});
      }
    },
    [roomId, username]
  );

  // 메시지 송신
  const sendChat = useCallback(
    (chat) => {
      // devLog("채팅 송신:", chat, roomId, username, socketRef.current);
      if (chat && roomId && username && socketRef.current) {
        socketRef.current.emit("send-chat", {roomId, chat, username});
      }
    },
    [roomId, username]
  );

  const saveData = useCallback(
    (data) => {
      devLog("서버에 데이터 저장:", data, roomId, username, socketRef.current);
      if (data && roomId && username && socketRef.current) {
        socketRef.current.emit("save-data", {roomId, data});
      }
    },
    [roomId, username]
  );

  const clearData = useCallback(() => {
    devLog("서버에 데이터 삭제 요청:", roomId, username, socketRef.current);
    if (roomId && username && socketRef.current) {
      socketRef.current.emit("clear-data", {roomId});
    }
  }, [roomId, username]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  return {joinRoom, sendMessage, sendData, sendCalc, sendChat, saveData, clearData, disconnect, socketRef, responseRef};
};

export default useSocketClient;

/* 상위컴포넌트 사용 예시 
const { joinRoom, sendMessage, responseRef } = SocketClient({
    roomId,
    username,
    onMessage: handleIncomingMessage,
  });
*/
