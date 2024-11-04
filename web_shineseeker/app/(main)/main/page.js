"use client";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import MainSlide from "./MainSlide";
import MainLoginForm from "./MainLoginForm";
import MainAudioPlayer from "./MainAudioPlayer";

import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정

const menuName = "main";
export default function Home() {
  const {tokenRef} = useAuth() || {}; // handleLogin 가져오기
  const [maindata, setMainData] = useState([]);
  const [slideData, setSlideData] = useState([]);
  const [mainAudioUrl, setMainAudioUrl] = useState("");
  const [user, setUser] = useState({});
  let fetchIndex = 0;
  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response = await fetch(`/api/select?apitype=page&pagename=${menuName}&getcount=1`);
    console.log("야 메인 땡긴다?", response, tokenRef);
    // if (fetchIndex++ == 0) response = await fetch(`/api/select?apitype=${menuName}&getcount=1`);
    // else response = await fetch(`/api/select?apitype=${menuName}`);
    const newData = await response.json();
    if (newData?.data?.length) {
      console.log(`admin *** ${menuName} *** page data 갱신되었습니다(${fetchIndex}): `, newData);
      setMainData([...newData.data]);
    }
  }
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  useEffect(() => {
    let slideData = [],
      audioData;
    if (maindata.length) {
      slideData = maindata.filter((data) => data.id.includes("main_img") && data.value).map((data) => ({imageUrl: data.value}));
      audioData = maindata.filter((data) => data.id.includes("main_youtube") && data.value).map((data) => data.value);
      setSlideData(slideData);
      if (audioData.length) setMainAudioUrl(audioData[0]);
    }
    console.log("maindata filter :", slideData, audioData);
  }, [maindata]);
  return (
    <>
      <div className="relative flex" style={{minWidth: "932px", height: "311px"}}>
        <div className="relative login col-span-2 max-h-full mr-4" style={{minWidth: "254px", height: "311px"}}>
          <div className="relative img-login-bg flex flex-col items-center h-full">
            <MainLoginForm />
          </div>
        </div>
        <div className="col-span-4 max-h-full" style={{height: "inherit"}}>
          <MainSlide slides={slideData.length ? slideData : null} />
        </div>
      </div>
      <div className="relative flex w-full" style={{width: "903px", height: "90px", left: "-10px", marginTop: "20px"}}>
        <div className="" style={{width: "245px", height: "80px", marginTop: "4px"}}>
          <MainAudioPlayer url={mainAudioUrl} />
        </div>
        <div className="relative flex" style={{marginLeft: "64px"}}>
          <Link className="relative main-button" href="/main">
            <Image src="/images/home/01_home_button01.png" width={170} height={90} alt="Shineseeker" />
          </Link>
          <Link className="relative main-button" href="/main">
            <Image src="/images/home/01_home_button02.png" width={170} height={90} alt="Shineseeker" />
          </Link>
          <Link className="relative main-button" href="/main">
            <Image src="/images/home/01_home_button03.png" width={170} height={90} alt="Shineseeker" />
          </Link>
        </div>
      </div>
    </>
  );
}
