import React, {useState, useEffect} from "react";

// NotificationModal 컴포넌트
const NotificationModal = ({onClose, type = "INFO", message = "", duration = 3000, css = ""}) => {
  const [isVisible, setIsVisible] = useState(false); // 초기엔 보이지 않음

  useEffect(() => {
    // 나타나기 효과
    setIsVisible(true);

    // 설정된 시간 후에 사라지기 시작
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // 컴포넌트 언마운트 시 타이머 정리
    const closeTimer = setTimeout(() => {
      if (onClose) onClose(); // 부모 컴포넌트에서 닫기 콜백 실행
    }, duration + 500); // 트랜지션 지속시간(500ms)만큼 추가

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const bgColor = type === "INFO" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`fixed bottom-4 left-4 p-4 text-white rounded shadow-lg transition-all duration-500 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${bgColor}`}>
      <span className={"text-xl font-bold " + css}>{message}</span>
    </div>
  );
};

export default NotificationModal;
