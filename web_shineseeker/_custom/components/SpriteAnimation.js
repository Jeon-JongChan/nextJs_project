import {useEffect, useRef, useImperativeHandle, forwardRef, useState} from "react";

const SpriteAnimation = forwardRef(
  (
    {
      spriteImage,
      frameWidth,
      frameHeight,
      cols, // 프레임 가로 칸
      rows, // 프레임 세로 줄
      totalFrame,
      frameDuration = 100,
      scale = 1, // 확대/축소 배율
      css = "",
      playCount = Infinity, // 재생 횟수 (기본값: 무한)
      defaultVisible = true, // 컴포넌트 초기 가시성
    },
    ref
  ) => {
    let totalFrames = totalFrame || cols * rows; // 전체 프레임 수 계산
    const spriteRef = useRef(null); // 스프라이트 div 참조
    const currentFrameRef = useRef(0); // 현재 프레임을 Ref로 관리
    const repeatCountRef = useRef(0); // 반복 횟수 관리
    const lastUpdateTimeRef = useRef(0); // 마지막 업데이트 시간 관리
    const animationIdRef = useRef(null); // requestAnimationFrame ID 저장
    const [isVisible, setIsVisible] = useState(defaultVisible); // 가시성 상태를 상태로 관리

    const animateSprite = (timestamp) => {
      // 재생 횟수 초과 시 애니메이션 종료
      if (repeatCountRef.current >= playCount) {
        stopAnimation(); // 애니메이션 종료
        return; // 애니메이션 종료 후 더 이상 실행되지 않도록
      }
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = timestamp;
      }

      const timeDiff = timestamp - lastUpdateTimeRef.current;

      if (timeDiff > frameDuration) {
        const frameX = currentFrameRef.current % cols; // 가로 칸에 맞게 계산
        const frameY = Math.floor(currentFrameRef.current / cols); // 세로 줄에 맞게 계산

        if (spriteRef.current) {
          spriteRef.current.style.backgroundPosition = `-${frameX * frameWidth * scale}px -${frameY * frameHeight * scale}px`;
        }

        currentFrameRef.current += 1;

        // 마지막 프레임 도달 시 처리
        if (currentFrameRef.current >= totalFrames) {
          currentFrameRef.current = 0; // 프레임 초기화
          repeatCountRef.current += 1; // 반복 횟수 증가
        }

        lastUpdateTimeRef.current = timestamp;
      }

      // 계속 애니메이션을 실행하기 위해 requestAnimationFrame을 사용
      animationIdRef.current = requestAnimationFrame(animateSprite);
    };

    const startAnimation = () => {
      setIsVisible(true);
      currentFrameRef.current = 0; // 프레임 초기화
      repeatCountRef.current = 0; // 반복 횟수 초기화
      lastUpdateTimeRef.current = 0; // 업데이트 시간 초기화
      animationIdRef.current = requestAnimationFrame(animateSprite);
      console.log(" spriteAnimation.js  ++++++ startAnimation", isVisible, animationIdRef.current);
    };

    const stopAnimation = () => {
      if (isVisible && animationIdRef.current) {
        setIsVisible(false);
        cancelAnimationFrame(animationIdRef.current); // 애니메이션 정지
        animationIdRef.current = null;
        if (spriteRef.current) console.log(" spriteAnimation.js  stopAnimation", spriteRef.current, spriteRef.current.style, spriteRef.current.style.display);
        else console.log(" spriteAnimation.js  stopAnimation", spriteRef.current);
      }
    };

    // 외부에서 사용할 수 있는 메서드 설정
    useImperativeHandle(ref, () => ({
      start: startAnimation,
      stop: stopAnimation,
      isRunning: () => isVisible, // 현재 실행 상태 확인
      setIsVisible, // 외부에서 가시성 상태 변경 가능
    }));

    useEffect(() => {
      console.log(" spriteAnimation.js  useEffect", defaultVisible, isVisible);
      if (defaultVisible && isVisible) {
        startAnimation(); // 초기 가시성 상태가 true라면 애니메이션 시작
      }

      return () => {
        stopAnimation(); // 컴포넌트 언마운트 시 애니메이션 정지
      };
    }, [isVisible]);

    return isVisible ? (
      <div
        ref={spriteRef}
        className={css}
        style={{
          width: frameWidth * scale,
          height: frameHeight * scale,
          backgroundImage: `url(${spriteImage})`,
          backgroundSize: `${frameWidth * cols * scale}px ${frameHeight * rows * scale}px`,
          backgroundRepeat: "no-repeat",
          position: "absolute",
          transformOrigin: "top left",
          zIndex: 10,
          display: isVisible ? "block" : "none",
        }}
      ></div>
    ) : null;
  }
);

export default SpriteAnimation;
