"use client";
import {useState, useEffect} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

export default function Home(props) {
  const [baseinfo, setBaseInfo] = useState("");
  const [detailinfo, setDetailInfo] = useState("");
  const [oncetext, setOnceText] = useState("");
  useEffect(() => {
    console.log("TabInfo useEffect", props);
    // textarea에 기본정보, 상세정보를 채워넣는다.
    if (props?.user) {
      if (props.user?.usertab_baseinfo) setBaseInfo(props.user.usertab_baseinfo);
      if (props.user?.usertab_detailinfo) setDetailInfo(props.user.usertab_detailinfo);
      if (props.user?.usertab_first_word) setOnceText(props.user.usertab_first_word);
    }
  }, [props]);
  return (
    <>
      <div className="flex flex-col w-full px-5 py-2">
        <div className="memeter-tab">
          <h2 className="text-white text-[24px]">기본정보</h2>
          <pre className="memeter_tab_baseinfo w-[500px] h-[70px] bg-white text-balance text-x-wrap font-nexon">{baseinfo}</pre>
        </div>
        <div className="memeter-tab">
          <h2 className="text-white text-[24px]">상세정보</h2>
          <pre className="memeter_tab_detailinfo w-[500px] h-[120px] bg-white text-balance text-x-wrap font-nexon">{detailinfo}</pre>
        </div>
      </div>
      <h1 className="member_once_text absolute text-white text-[16px]" style={{bottom: "20px", left: "25px"}}>
        &quot;{oncetext}&quot;
      </h1>
    </>
  );
}
