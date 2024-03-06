"use client";
import {useState} from "react";

export default function Component() {
  const [isFolded, setIsFolded] = useState(false); // 텍스트가 접혀있는지 여부를 추적하는 상태

  // 텍스트를 접거나 펼치는 함수
  const toggleFold = () => {
    setIsFolded(!isFolded); // 상태를 반전시킴 (접혔으면 펼치고, 펼쳤으면 접음)
  };
  return (
    <>
      <div className="fixed bottom-2 right-0 bg-orange-100 p-4 border-t border-gray-300" style={{width: !isFolded ? "30vw" : "10vw", height: !isFolded ? "30vw" : "5vw"}}>
        {!isFolded && (
          <>
            <h3>개발 중 노트</h3>
            <div>
              <span>현재 멤버 상세 페이지 개발중</span>
              <br />
              <span>- 스탯페이지 프레임 구현</span>
              <br />
              <span>- 인벤토리 프레임 구현 중</span>
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
