"use client";
import {useState, useEffect} from "react";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정
import Image from "next/image";
import Link from "next/link";
import {devLog} from "@/_custom/scripts/common";

export default function Component(props) {
  const [user, setUser] = useState({});
  const {handleLogin, handleLogout, tokenRef} = useAuth() || {}; // handleLogin 가져오기
  const [activePatrol, setActivePatrol] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // FormData 객체 생성
    const username = formData.get("userid"); // 사용자명 가져오기
    const password = formData.get("userpw"); // 비밀번호 가져오기
    if (handleLogin) {
      devLog("로그인 시도:", username, password, handleLogin); // 시도 메시지
      const token = await handleLogin(username, password); // 로그인 처리
      if (token) {
        devLog("로그인 성공:", token); // 성공 메시지
      } else {
        console.error("로그인 실패 --- ", token); // 실패 메시지
      }
    }
  };

  const logout = async () => {
    if (handleLogout) {
      devLog("로그아웃 시도:", tokenRef.current); // 시도 메시지
      await handleLogout(); // 로그아웃 처리
      devLog("로그아웃 성공", tokenRef.current); // 성공 메시지
    }
  };

  useEffect(() => {
    devLog("로그인 컴포넌트 렌더링:", tokenRef.current);
    setUser(tokenRef.current?.user);
    if (props?.activePatrol && props?.activePatrol === "O") setActivePatrol(true);
  }, [tokenRef.current]);
  return (
    <>
      {!user ? (
        <form onSubmit={handleSubmit} className="absolute rounded-lg flex" style={{width: "195px", bottom: "25px"}}>
          <button type="submit" className="relative" style={{minWidth: "53px"}}>
            <Image src="/images/home/01_home_login_box_button.png" alt="Shineseeker" width={53} height={53} />
          </button>
          <div className="col-span-2" style={{width: "131px", height: "48px", fontSize: "14px"}}>
            <input type="text" placeholder="ID" id="username" name="userid" className="mt-1 p-2 block w-full border-gray-300 rounded-full focus:outline-none" style={{height: "22px"}} />
            <input type="password" placeholder="PW" id="password" name="userpw" className="mt-1 p-2 block w-full border-gray-300 rounded-full focus:outline-none" style={{height: "22px"}} />
          </div>
          {/* <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          로그인
        </button> */}
        </form>
      ) : (
        <>
          <div className="absolute text-center font-dnf text-[20px]" style={{top: "20px"}}>
            <button onClick={() => logout()} className="text-[#6231C5]">
              로그아웃
            </button>
          </div>
          <pre className="absolute text-center font-dnf text-[20px]" style={{top: "140px"}}>
            {user?.name} 님
          </pre>
          <div className="absolute rounded-lg grid grid-cols-3 text-center font-dnf text-[20px]" style={{width: "182px", bottom: "40px", left: "40px"}}>
            <div className="col-span-1">
              {activePatrol ? (
                <Link href="/battle/patrol" className="text-[#6231C5]">
                  패트롤
                </Link>
              ) : (
                <span className="text-gray-700">패트롤</span>
              )}
              <span className="text-black" style={{marginLeft: "2px"}}>
                |
              </span>
            </div>
            <div className="col-span-1">
              <Link href={`/member/${user.name}`} style={{marginLeft: "3px"}}>
                캐릭터
              </Link>
              <span className="text-black" style={{marginLeft: "3px"}}>
                |
              </span>
            </div>
            <div className="col-span-1">
              <button onClick={() => alert("연습장")} className="text-[#6231C5]">
                연습장
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
