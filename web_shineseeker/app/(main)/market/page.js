"use client";
import {useState, useEffect} from "react";
import Image from "next/image";

const menuName = "market";
export default function Home(props) {
  const npcTextColor = " text-[#7b3e51]";
  const [maindata, setMainData] = useState([]);
  const [username, setUsername] = useState("플레이어");

  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response = await fetch(`/api/select?apitype=page&getcount=1&pagename=${menuName}&getcount=1`);
    console.log("야 메인 땡긴다?", response);
    // if (fetchIndex++ == 0) response = await fetch(`/api/select?apitype=${menuName}&getcount=1`);
    // else response = await fetch(`/api/select?apitype=${menuName}`);
    const newData = await response.json();
    if (newData?.data?.length) {
      console.log(`admin *** ${menuName} *** page data 갱신되었습니다: `, newData);
      setMainData([...newData.data]);
    }
  }
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  /* prettier-ignore */
  useEffect(() => {
    let contents = {};
    
    if (maindata.length) {
    }
      
    console.log("maindata:", contents);
  }, [maindata]);

  useEffect(() => {
    if (props?.username) {
      setUsername(props?.username);
    }
  }, []);
  return (
    <div id="market" className="w-full h-full relative">
      <div className="relative img-market-init img-market-bg flex w-full h-full">
        <div className="relative img-market-npc flex" style={{top: "56px", left: "30px"}}>
          <div className="absolute market_npc_banner img-market-banner" style={{width: "301px", height: "103px", bottom: "20px", left: "20px"}}>
            <span className="absolute text-white text-[16px]" style={{left: "15px"}}>
              요정헤이프릴
            </span>
            <div className={"market_npc_text relative text-[12px] px-2 py-1 font-nexon font-bold" + npcTextColor} style={{top: "20px"}}>
              <span className={"" + npcTextColor}>
                안녕하세요 <span className="text-[#FF0050]">{username}</span>
              </span>
              {/* prettier-ignore */}
              <pre className="absolute no-scrollbar text-x-wrap" style={{width: "290px", height: "50px"}}>
                오늘은 어떤 물품을 교환하시겠어요? <br/>
                천천히 둘러보세요~
              </pre>
            </div>
          </div>
        </div>
        <div className="absolute market-itembox flex p-2 overflow-y-auto" style={{width: "530px", height: "230px", top: "125px", right: "70px"}}>
          <Item />
        </div>
        <div className="absolute market-costbox flex justify-center items-center" style={{width: "160px", height: "40px", top: "40px", right: "60px"}}>
          <span className="inline-block text-[20px] w-[160px] text-right text-line-wrap">{1000000000000000000}</span>
          <span className="text-[18px] text-[#ff7ea7] ml-2">AKA</span>
          <span className="absolute text-[#b094f3] w-[300px] text-right font-nexon font-bold text-[12px]" style={{top: "60px", right: "20px"}}>
            *마우스 클릭시 아이템이 구매됩니다.
          </span>
        </div>
      </div>
    </div>
  );
}

function Item(props) {
  return (
    <div className="relative market-itembox-item img-market-init img-market-itemframe flex" style={{width: "150px", height: "65px"}}>
      <div className="market-itembox-item-image flex justify-center items-center max-h-[45px] min-h-[45px] max-w-[45px] min-w-[45px]" style={{width: "45px", height: "45px", margin: "10px 8px 6px 6px"}}>
        <Image src="https://via.placeholder.com/100?text=Image+1" className="relative max-h-[40px] min-h-[40px] max-w-[40px] min-w-[40px]" width={40} height={40} alt="item image" />
      </div>
      <div className="market-itembox-item-info flex flex-col p-1 font-nexon font-bold h-full" style={{width: "100px", marginLeft: "5px"}}>
        <div className="w-full flex flex-row justify-center items-center mt-2">
          <span className="text-white text-[10px] w-[36px] text-center">아이템</span>
          <span className="text-[10px] text-center text-line-wrap">1000 AKA</span>
        </div>
        <p className="text-[12px] text-x-wrap no-scrollbar" style={{width: "90px", height: "35px", marginLeft: "5px"}}>
          아이템 설명ddddd
        </p>
      </div>
    </div>
  );
}
