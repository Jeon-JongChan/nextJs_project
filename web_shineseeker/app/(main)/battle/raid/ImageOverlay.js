"use client";

import {useEffect, useRef, useState} from "react";

export default function ImageOverlay({imageSrc, interval = 5000}) {
  const [visible, setVisible] = useState(false); // 애니메이션 상태 관리
  const imageRef = useRef(null); // 이미지 DOM 참조

  useEffect(() => {
    const toggleImage = () => {
      const img = imageRef.current;

      // 초기 위치를 JavaScript로 설정 (-100%)
      if (img) {
        img.style.transform = "translateX(-100%)";
      }

      setTimeout(() => {
        // Fade-in 및 이동 애니메이션 시작
        setVisible(true);
      }, 10); // 짧은 딜레이로 애니메이션 트리거

      setTimeout(() => {
        // Fade-out 애니메이션 시작
        setVisible(false);
      }, 3000); // 이미지 유지 시간
    };

    // 초기 렌더링 시 실행
    toggleImage();

    // 반복 실행
    const intervalId = setInterval(toggleImage, interval);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [imageSrc, interval]);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-500`}>
      <img ref={imageRef} src={imageSrc} alt="Overlay" className={`w-full h-auto transform transition-all duration-500 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
