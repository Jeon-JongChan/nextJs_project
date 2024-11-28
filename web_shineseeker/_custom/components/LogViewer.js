import React, {useEffect, useRef, useState} from "react";
import {devLog} from "../scripts/common";

const LogViewer = ({logs, height = "300px", logColors = {info: "white", critical: "red"}, css = "", opacity = 0.9}) => {
  const logContainerRef = useRef(null); // 로그 컨테이너 참조
  const [log, setLog] = useState([]);

  useEffect(() => {
    const container = logContainerRef.current;
    // 스크롤이 맨 아래에 있는지 확인
    const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

    if (!isAtBottom) {
      // 새로운 로그 추가 시 스크롤을 맨 아래로 이동
      container.scrollTop = container.scrollHeight;
    }
    setLog(logs);
    devLog("로그뷰어 실행", isAtBottom, container.scrollHeight, container.scrollTop, container.clientHeight);
  }, [logs]); // logs가 변경될 때 실행

  return (
    <div
      ref={logContainerRef}
      className={css}
      style={{
        height: height, // 컨테이너 높이
        overflowY: "auto", // 스크롤 생성
        backgroundColor: `rgba(0, 0, 0, ${opacity})`, // 검은색 배경
        color: "white", // 기본 텍스트 색상
        padding: "10px",
        fontFamily: "monospace", // 로그 스타일
      }}
    >
      {log.map((log, index) => (
        <div
          key={index}
          style={{
            color: logColors[log.level] || "white", // level에 따라 색상 지정
          }}
        >
          {log?.log || ""} <span className="text-[10px]">{` (${log?.time})`}</span>
        </div>
      ))}
    </div>
  );
};

export default LogViewer;
