"use client";
import {useState, useEffect} from "react";
import Image from "next/image";

export default function Home(props) {
  const npcTextColor = " text-[#7b3e51]";
  const [username, setUsername] = useState("플레이어");

  useEffect(() => {
    if (props?.username) {
      setUsername(props?.username);
    }
  }, []);
  return (
    <div id="market" className="w-full h-full relative">
      <div className="img-market-init img-market-bg relative flex w-full h-full">
        <div className="absolute img-market-init img-market-npc flex" style={{top: "55px", left: "30px"}}>
          <div className="market_npc_banner img-market-init img-market-banner absolute w-full h-[154px]" style={{bottom: "20px", left: "20px"}}>
            <span className="absolute text-white text-[24px]" style={{left: "30px"}}>
              요정헤이프릴
            </span>
            <div className={"market_npc_text relative text-[16px] px-6 py-1 font-nexon font-bold" + npcTextColor} style={{top: "40px"}}>
              <span className={"" + npcTextColor}>안녕하세요 {username}</span>
              <pre>오늘은 어떤 물품을 교환하시겠어요? 천천히 둘러보세요~</pre>
            </div>
          </div>
        </div>
        <div className="market-itembox relative flex w-2/3 h-[350px] max-w-[800px] p-4" style={{top: "160px", left: "30px"}}>
          <Item />
        </div>
        <div className="market-costbox relative flex justify-center items-center h-[40px]" style={{top: "55px", left: "-90px"}}>
          <span className="inline-block text-[24px] w-[180px] text-right text-line-wrap">{1000000000000000000}</span>
          <span className="text-[18px] text-[#ff7ea7] ml-2">AKA</span>
          <span className="absolute text-[#b094f3] w-[300px] text-right font-nexon font-bold" style={{top: "80px", right: "20px"}}>
            *마우스 클릭시 아이템이 구매됩니다.
          </span>
        </div>
      </div>
    </div>
  );
}

function Item(props) {
  return (
    <div className="market-itembox-item img-market-init img-market-itemframe relative flex">
      <div className="market-itembox-item-image flex justify-center items-center w-1/3">
        <Image src="https://via.placeholder.com/500?text=Image+1" className="relative" width={60} height={60} style={{left: "5px"}} alt="item image" />
      </div>
      <div className="market-itembox-item-info flex flex-col w-2/3 p-2 font-nexon font-bold">
        <div className="w-full flex flex-row justify-center items-center mt-2">
          <span className="text-white text-[16px] w-full">아이템</span>
          <span className="text-[12px] text-center w-full">1000 AKA</span>
        </div>
        <p className="text-[12px] text-balance overflow-hidden " style={{width: "130px", height: "48px"}}>
          아이템 설명ddddd
        </p>
      </div>
    </div>
  );
}
