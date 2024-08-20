"use client";
import Image from "next/image";
import {useState} from "react";
import {getTestImageUrl} from "@/_custom/utils";

export default function Component() {
  const [isSelector, setIsSelector] = useState(true); // 텍스트가 접혀있는지 여부를 추적하는 상태
  function viewSelector() {
    return (
      <div className="selector relative flex-1 ml-[100px] w-full img-patrol-init img-patrol-selector-bg" style={{width: "1200px", height: "400px"}}>
        <div className="patrol-round-photo absolute" style={{width: "330px", height: "344px", top: "28px", left: "30px"}}>
          <Image src={getTestImageUrl(200, 200)} alt="이미지" fill={true} />
        </div>
        <h1 className="patrol-selector-title absolute top-[35px] left-[480px] text-white text-2xl overflow-hidden"> text </h1>
        <pre className="patrol-selector-pre absolute top-[75px] left-[480px] text-white text-xl text-pretty overflow-y-scroll no-scrollbar" style={{width: "650px", height: "100px"}}>
          삭막한 이도시가 물들때까지 고개들고 뭐 모두가 향기가 어쩌고 웃을때까지 삭막한 이도시가 물들때까지 고개들고 뭐 모두가 향기가 어쩌고 웃을때까지 삭막한 이도시가 물들때까지 고개들고 뭐 모두가
          향기가 어쩌고 웃을때까지 삭막한 이도시가 물들때까지 고개들고 뭐 모두가 향기가 어쩌고 웃을때까지
        </pre>
        <div className="patrol-selector-startbox absolute w-[750px] top-[200px] left-[430px]">
          <button className="patrol-selector-bar relative m-2" onClick={() => setIsSelector(!isSelector)}>
            <img src="/images/patrol/05_patrol_startbox_bar.png" />
            <p className="absolute text-nowrap overflow-hidden w-[700px] top-0 px-4 py-3">
              ★ 어쩌고저쩌고 어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고
            </p>
          </button>
          <button className="patrol-selector-bar relative m-2">
            <img src="/images/patrol/05_patrol_startbox_bar.png" />
            <p className="absolute text-nowrap overflow-hidden w-[700px] top-0 px-4 py-3">★ 어쩌고저쩌고 어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고</p>
          </button>
          <button className="patrol-selector-bar relative m-2">
            <img src="/images/patrol/05_patrol_startbox_bar.png" />
            <p className="absolute text-nowrap overflow-hidden w-[700px] top-0 px-4 py-3">★ 어쩌고저쩌고 어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고</p>
          </button>
        </div>
      </div>
    );
  }

  function viewResult() {
    return (
      <div className="selector relative flex-1 ml-[100px] w-full img-patrol-init img-patrol-end-bg" style={{width: "1200px", height: "400px"}}>
        <div className="absolute top-[20px] right-[20px]">
          <img src="/images/patrol/05_patrol_endbox_bar_stemina.png" />
          <span id="patrol-end-stamina" className="absolute flex flex-col justify-center align-middle" style={{width: "30px", height: "50px", top: "4px", left: "172px", fontSize: "24px"}}>
            05
          </span>
        </div>
        <div className="img-init img-patrol-end-photoframe absolute top-[50px] left-[44%]" style={{width: "180px", height: "180px"}}>
          <div className="patrol-round-endphoto w-full h-full absolute" style={{width: "174px", height: "174px", top: "3px", left: "3px"}}>
            <Image src={getTestImageUrl(200, 200)} alt="이미지" fill={true} style={{objectFit: "scale-down"}} />
          </div>
        </div>
        <button className="patrol-end-bar absolute bottom-[100px] left-[160px]" onClick={() => setIsSelector(!isSelector)}>
          <img src="/images/patrol/05_patrol_endbox_bar.png" />
          <p className="absolute text-nowrap overflow-hidden w-[700px] top-0 px-4 py-3">★ 어쩌고저쩌고 어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고</p>
        </button>
        <div className="absolute bottom-[40px] left-[160px] flex justify-center items-center" style={{width: "900px", fontSize: "24px"}}>
          <span className="text-red-400">★</span> <span className="patrol-end-item">??????</span> <span className="text-red-400">을(를) 획득하였습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full" style={{width: "1400px", height: "600px"}}>
        {isSelector ? viewSelector() : viewResult()}
        <div className="img-patrol-init img-patrol-timeline-bg ml-0 md:ml-5 relative" style={{height: "200px"}}>
          <pre className="patrol-log absolute bottom-0 py-5 px-20 text-white text-xl text-pretty overflow-y-scroll no-scrollbar w-full h-full">
            <p className="text-nowrap overflow-hidden top-0 px-4 py-3 w-full">
              ★ 어쩌고저쩌고 어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고★ 어쩌고저쩌고 어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고★
              어쩌고저쩌고 어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고
            </p>
          </pre>
        </div>
      </div>
    </>
  );
}
/*

*/
