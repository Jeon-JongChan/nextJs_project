"use client";
import Image from "next/image";
import {useState} from "react";
import {getTestImageUrl} from "@/_custom/scripts/common";

export default function Component() {
  const [isSelector, setIsSelector] = useState(true); // 텍스트가 접혀있는지 여부를 추적하는 상태

  return (
    <>
      <div className="flex flex-col w-full mt-4" style={{width: "840px", height: "600px"}}>
        {isSelector ? <Selector changeFunc={() => setIsSelector(!isSelector)} /> : <Result changeFunc={() => setIsSelector(!isSelector)} />}
        <div className="img-patrol-init img-patrol-timeline-bg patrol-timeline flex flex-row w-full mt-4" style={{height: "126px"}}></div>
      </div>
    </>
  );
}

function Selector(props) {
  const changeFunc = props.changeFunc;
  return (
    <div className="img-patrol-init img-patrol-selector-bg patrol-selector relative w-full" style={{height: "275px"}}>
      <div className="absolute patrol-selector-icon w-[113px] h-[113px]" style={{top: "95px", left: "115px"}}>
        <Image src={"https://via.placeholder.com/500?text=Image+1"} fill={true} />
      </div>
      <div className="absolute patrol-selector-area w-[400px] h-[20px] text-[#9889FF]" style={{top: "60px", left: "290px"}}>
        <span>★ 미국 캘리포니아</span>
      </div>
      <div className="absolute patrol-selector-text w-[440px] font-nexon text-white " style={{top: "90px", left: "290px"}}>
        <span className="font-bold">[도와주기] </span>
        <p className="h-[55px] overflow-y-hidden no-scrollbar">사람의 힘으로는 닿기 어려운 아주 높은 나무 위에 고양이 한 마리가 애처롭게 울고 있습니다. 당신은 어떻게 행동하나요?</p>
      </div>
      <div className="absolute patrol-selector-choices w-[456px] h-[60px] text-white flex flex-row justify-between" style={{top: "175px", left: "290px"}}>
        <button className="relative w-[130px] h-[60px] px-2" onClick={() => changeFunc()}>
          지나칠 수는 없으니 나무를 탄다
        </button>
        <button className="relative w-[130px] h-[60px] px-2" onClick={() => changeFunc()}>
          911에 전화신고를 한다.
        </button>
        <button className="relative w-[130px] h-[60px] px-2" onClick={() => changeFunc()}>
          시커의 힘을 사용한다.
        </button>
      </div>
    </div>
  );
}

function Result(props) {
  const changeFunc = props.changeFunc;
  return (
    <div className="img-patrol-init img-patrol-result-bg patrol-result relative w-full" style={{height: "275px"}}>
      <div className="absolute patrol-result-icon w-[113px] h-[113px]" style={{top: "60px", left: "363px"}}>
        <Image src={"https://via.placeholder.com/500?text=Image+1"} fill={true} />
      </div>
      <div className="absolute patrol-result-text w-[500px] h-[20px] text-center text-[#494EAF] text-line-warp" style={{top: "195px", left: "170px"}}>
        <span>아기 고양이를 구출했다! 잠깐... 이거 나 주는거야??</span>
      </div>
      <div className="absolute patrol-result-text2 w-[500px] h-[20px] text-center text-[#FF9DBC] text-line-warp" style={{top: "235px", left: "170px"}}>
        <span>
          ★ <span className="text-white">1000아카</span> 를 획득했습니다!
        </span>
      </div>
      <div className="absolute patrol-result-stamina flex flex-row justify-center w-[140px] h-[30px] text-[#2D3458]" style={{top: "55px", right: "55px"}}>
        <span>스태미나</span> <span className="text-[#D13586] patrol-result-remain ml-2">04</span> <span>/05</span>
      </div>
      <button className="absolute patrol-result-next img-patrol-init img-patrol-result-next" style={{top: "90px", right: "40px"}} onClick={() => changeFunc()}></button>
    </div>
  );
}
