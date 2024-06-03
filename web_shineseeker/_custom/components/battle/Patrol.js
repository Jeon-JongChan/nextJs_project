"use client";
import Image from "next/image";
import {useState} from "react";
import {getTestImageUrl} from "@/_custom/utils";

export default function Component() {
  return (
    <>
      <div className="flex flex-col w-full" style={{width: "1400px", height: "600px"}}>
        <div className="selector relative flex-1 ml-[100px] w-full img-patrol-init img-patrol-selector-bg" style={{width: "1200px", height: "400px"}}>
          <div className="patrol-selector-photo absolute" style={{width: "330px", height: "344px"}}>
            <Image src={getTestImageUrl(200, 200)} alt="이미지" fill={true} />
          </div>
          <h1 className="patrol-selector-title absolute top-[35px] left-[480px] text-white text-2xl overflow-hidden"> text </h1>
          <pre
            className="patrol-selector-pre absolute top-[75px] left-[480px] text-white text-xl text-pretty overflow-y-scroll no-scrollbar"
            style={{width: "650px", height: "100px"}}
          >
            삭막한 이도시가 물들때까지 고개들고 뭐 모두가 향기가 어쩌고 웃을때까지 삭막한 이도시가 물들때까지 고개들고 뭐 모두가 향기가 어쩌고 웃을때까지 삭막한 이도시가 물들때까지
            고개들고 뭐 모두가 향기가 어쩌고 웃을때까지 삭막한 이도시가 물들때까지 고개들고 뭐 모두가 향기가 어쩌고 웃을때까지
          </pre>
          <div className="patrol-selector-button absolute top-[200px] left-[480px]"></div>
        </div>
        <div className="ml-0 md:ml-5 img-patrol-init img-patrol-timeline-bg" style={{height: "200px"}}></div>
      </div>
    </>
  );
}
/*

*/
