import React, {useState} from "react";

export default function Home() {
  // 상태를 사용하여 입력 값을 저장
  const [userKey, setUserKey] = useState("");

  // 사용자 입력을 상태에 저장하는 함수
  const handleChange = (e) => {
    setUserKey(e.target.value);
  };

  // 버튼 클릭 시 실행될 함수
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/checkauth", {
        method: "POST", // HTTP 메소드 설정
        headers: {
          "Content-Type": "application/json", // 콘텐츠 타입 헤더 설정
        },
        body: JSON.stringify({key: userKey}), // 요청 본문에 입력 값을 포함
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`); // 응답이 성공적이지 않은 경우 에러 처리
      }

      // 응답 데이터 처리
      const data = await response.json();
      console.log(data); // 응답 로그 출력

      // 페이지를 '/' 경로로 리다이렉션
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col md:flex-row items-center">
        <input
          type="text"
          placeholder="user key input"
          className="input input-bordered w-full max-w-xs mb-4 md:mb-0 md:mr-4"
          value={userKey}
          onChange={handleChange} // 입력 값 변경 시 handleChange 함수 호출
        />
        <button
          className="btn btn-primary border-2 border-black min-w-10"
          onClick={handleSubmit} // 버튼 클릭 시 handleSubmit 함수 호출
        >
          전송
        </button>
      </div>
    </div>
  );
}
