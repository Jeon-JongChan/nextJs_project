"use client";
import {useState} from "react";

export default function Component() {
  const [isFolded, setIsFolded] = useState(true); // 텍스트가 접혀있는지 여부를 추적하는 상태

  // 텍스트를 접거나 펼치는 함수
  const toggleFold = () => {
    setIsFolded(!isFolded); // 상태를 반전시킴 (접혔으면 펼치고, 펼쳤으면 접음)
  };
  return (
    <>
      <div className="fixed bottom-2 right-0 bg-orange-100 p-4 border-t border-gray-300" style={{width: !isFolded ? "30vw" : "90px", height: !isFolded ? "30vw" : "50px", zIndex: "100"}}>
        {!isFolded && (
          <>
            <h3>개발 중 노트</h3>
            {/* prettier-ignore */}
            <div className="overflow-y-scroll no-scrollbar h-[27vw]">
              <span>관리자페이지 개발완료</span>
              <br /><span>이미지 교체 1차 완료</span>
              <br /><span>레이드 제작 및 교체 아직 안함</span>
              <br /><span>이미지 리사이징 작업 아직 안함 </span>
              <br /><span>페이지별 서버 액션 작업 아직 안함</span>
              <br />
            </div>
          </>
        )}
        {/* 버튼을 클릭하면 접거나 펼치는 기능을 수행하는 버튼 */}
        <button className="absolute px-4 py-2 bottom-1 right-1 font-black border-black border-2" onClick={toggleFold}>
          {isFolded ? "펼치기" : "접기"}
        </button>
      </div>
    </>
  );
}
