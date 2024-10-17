"use client";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import MainSlide from "./MainSlide";
import MainLoginForm from "./MainLoginForm";
import MainAudioPlayer from "./MainAudioPlayer";

const menuName = "main";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [slideData, setSlideData] = useState([]);
  const [user, setUser] = useState({});
  let fetchIndex = 0;
  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response = await fetch(`/api/select?apitype=page&getcount=1&pagename=${menuName}&getcount=1`);
    console.log("야 메인 땡긴다?", response);
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
    let slideData = [];
    if (maindata.length) {
      slideData = maindata.filter((data) => data.id.includes("main_img") && data.value).map((data) => ({imageUrl: data.value}));
      setSlideData(slideData);
    }
    console.log("maindata:", slideData);
  }, [maindata]);
  return (
    <>
      <div className="relative grid grid-cols-6" style={{height: "400px"}}>
        <div className="relative login col-span-2 max-h-full mr-4" style={{height: "440px", top: "-30px"}}>
          <div className="relative img-login-bg flex flex-col items-center h-full">
            {/* 로고 */}
            <div className="text-white w-full py-4 px-28 " style={{height: "300px"}}>
              {/* <div className="relative w-full h-3/4 top-10"> <Image src="/images/home/01_butterfly.webp" alt="login logo" fill={true} /> </div> */}
            </div>
            {/* 로그인 폼 */}
            <MainLoginForm />
          </div>
        </div>
        <div className="col-span-4 max-h-full" style={{height: "inherit"}}>
          <MainSlide slides={slideData.length ? slideData : null} />
        </div>
      </div>
      <div className="grid grid-cols-6  w-full mt-8" style={{height: "400px"}}>
        <div className="col-span-2 mr-4 px-2">
          <MainAudioPlayer />
        </div>
        <div className="col-span-4 grid grid-cols-3 gap-x-3">
          <Link className="col-span-1 relative main-button" href="/main">
            <Image src="/images/home/01_home_button01.png" alt="Shineseeker" fill={true} />
          </Link>
          <Link className="col-span-1 relative main-button" href="/main">
            <Image src="/images/home/01_home_button02.png" alt="Shineseeker" fill={true} />
          </Link>
          <Link className="col-span-1 relative main-button" href="/main">
            <Image src="/images/home/01_home_button03.png" alt="Shineseeker" fill={true} />
          </Link>
        </div>
      </div>
    </>
  );
}
