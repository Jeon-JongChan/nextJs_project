"use client";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정

export default function LoginForm() {
  const {handleLogin, handleLogout, tokenRef} = useAuth() || {}; // handleLogin 가져오기

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // FormData 객체 생성
    const username = formData.get("userid"); // 사용자명 가져오기
    const password = formData.get("userpw"); // 비밀번호 가져오기
    if (handleLogin) {
      console.log("로그인 시도:", username, password, handleLogin); // 시도 메시지
      const token = await handleLogin(username, password); // 로그인 처리
      if (token) {
        console.log("로그인 성공:", token); // 성공 메시지
      } else {
        console.error("로그인 실패"); // 실패 메시지
      }
    }
  };

  const logout = async () => {
    if (handleLogout) {
      console.log("로그아웃 시도:", tokenRef.current); // 시도 메시지
      await handleLogout(); // 로그아웃 처리
      console.log("로그아웃 성공", tokenRef.current); // 성공 메시지
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen p-10">
      <div className="mb-4">
        <label htmlFor="userid" className="block text-sm font-medium text-gray-700">
          사용자 ID
        </label>
        <input id="userid" name="userid" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="userpw" className="block text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input id="userpw" name="userpw" type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition duration-200">
        로그인
      </button>
      <button type="button" onClick={() => logout()} className="w-full bg-red-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition duration-200">
        로그아웃
      </button>
    </form>
  );
}
