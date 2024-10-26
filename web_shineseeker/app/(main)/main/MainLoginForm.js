"use client";
import {useState, useEffect} from "react";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정
import Image from "next/image";
import Link from "next/link";

export default function Component() {
  const [user, setUser] = useState({});
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

  useEffect(() => {
    console.log("로그인 컴포넌트 렌더링:", tokenRef.current);
    setUser(tokenRef.current?.user);
  }, [tokenRef.current]);
  return (
    <>
      {!user ? (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 rounded-lg grid grid-cols-3" style={{width: "320px"}}>
          <button type="submit" className="col-span-1 relative" style={{margin: "4px 4px"}}>
            <Image src="/images/home/01_home_login_box_button.png" alt="Shineseeker" fill={true} />
          </button>
          <div className="col-span-2">
            <input type="text" placeholder="ID" id="username" name="userid" className="mt-1 p-2 block w-full border-gray-300 rounded-full focus:outline-none" />
            <input type="password" placeholder="PW" id="password" name="userpw" className="mt-1 p-2 block w-full border-gray-300 rounded-full focus:outline-none" />
          </div>
          {/* <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          로그인
        </button> */}
        </form>
      ) : (
        <>
          <div className="max-w-md mx-auto p-6 rounded-lg grid grid-cols-3" style={{width: "320px"}}>
            <div className="col-span-1">
              <Link href="/battle/patrol">패트롤</Link>
            </div>
            <div className="col-span-2">
              <div className="flex justify-between">
                <Link href={`/member/${user.name}`}>캐릭터</Link>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    alert("연습장");
                  }}
                >
                  연습장
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
