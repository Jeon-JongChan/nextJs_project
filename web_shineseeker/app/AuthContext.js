"use client";
import React, {createContext, useRef, useContext, useState, useEffect} from "react";
import {SessionProvider, useSession, signIn, signOut, getSession} from "next-auth/react";

// Context 생성
export const AuthContext = createContext(null);

// AuthProvider 컴포넌트 생성
export const AuthProvider = ({children}) => {
  return (
    <SessionProvider>
      <AuthContextInner>{children}</AuthContextInner>
    </SessionProvider>
  );
};

const AuthContextInner = ({children}) => {
  const {data: session} = useSession();
  const tokenRef = useRef(null); // useRef로 토큰 관리
  const [user, setUser] = useState(null); // 사용자 정보 관리 (선택 사항)

  // 로그인 처리 함수
  const handleLogin = async (userid, userpw, redirect = false) => {
    const result = await signIn("credentials", {
      redirect: redirect,
      userid,
      userpw,
      //   callbackUrl: "/main", // 로그인 성공 후 이동할 URL
    });
    if (result.error) {
      console.error("로그인 실패:", result.error);
      return null;
    }

    const newSession = await getSession();
    if (newSession) {
      tokenRef.current = newSession; // 토큰 업데이트
      setUser(newSession.user); // 사용자 상태 업데이트
      console.log("로그인 성공:", newSession);
      return newSession.user;
    }
    return null;
  };

  const handleLogout = async (redirect = false) => {
    await signOut({redirect: redirect});
    tokenRef.current = null;
    setUser(null);
  };

  useEffect(() => {
    const initializeSession = async () => {
      const newSession = await getSession();
      // console.log("getSession으로 초기화:", newSession);
      if (newSession) {
        tokenRef.current = newSession;
        setUser(newSession.user); // 사용자 정보 업데이트
      }
    };
    initializeSession();
  }, []);

  useEffect(() => {
    // console.log("AuthContextInner useEffect session 갱신", session);
    if (session) {
      tokenRef.current = session; // JWT 토큰을 useRef에 저장
    } else {
      tokenRef.current = null; // 로그아웃 시 토큰 초기화
    }
  }, [session]);

  // 로그인 상태 관련 데이터를 Context에 제공
  return <AuthContext.Provider value={{tokenRef, handleLogin, handleLogout, user}}>{children}</AuthContext.Provider>;
};

// Context를 쉽게 사용하기 위한 Hook
export const useAuth = () => useContext(AuthContext);
