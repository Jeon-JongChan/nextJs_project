"use client";
import {useState, useEffect} from "react";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정
import {devLog} from "@/_custom/scripts/common";
import {getImageUrl} from "@/_custom/scripts/client";
import Market from "./Market";

const menuName = "market";
export default function Home(props) {
  const {tokenRef} = useAuth() || {}; // handleLogin 가져오기
  const npcTextColor = " text-[#7b3e51]";
  const [npcName, setNpcName] = useState("요정헤이프릴");
  const [npcText, setNpcText] = useState(`오늘은 어떤 물품을 교환하시겠어요? \n천천히 둘러보세요~`);
  const [npcImage, setNpcImage] = useState("/images/market/06_shop_npc.png");
  const [maindata, setMainData] = useState([]);
  const [username, setUsername] = useState("플레이어");
  const [money, setMoney] = useState(0);
  const [items, setItems] = useState([]);

  //

  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchDataEssential() {
    let response = await fetch(`/api/select?apitype=page&getcount=1&pagename=${menuName}&getcount=1`);
    const newData = await response.json();
    devLog("야 메인 땡긴다?", response, newData);
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다: `, newData);
      setMainData([...newData.data]);
      // npc 이름 갱신
      const npcNameData = newData.data.filter((data) => data.id === "market_npc_name")[0];
      setNpcName(npcNameData?.value || npcName);
      // npc 대사 갱신
      const npcTextData = newData.data.filter((data) => data.id === "market_text")[0];
      setNpcText(npcTextData?.value || npcText);
      // npc 대사 갱신
      const npcImageData = newData.data.filter((data) => data.id === "market_img_npc")[0];
      setNpcImage(npcImageData?.value || npcText);

      // 아이템 리스트 갱신
      const itemList = newData.data.filter((data) => data.id === "market_item")[0];
      if (itemList.value) {
        const itemResponse = await fetch("/api/select?apitype=item&getcount=1");
        const allItems = await itemResponse.json();
        const items = JSON.parse(itemList.value);
        const itemData = allItems.data.filter((item) => items.includes(item.item_name));
        if (itemData.length) {
          setItems([...itemData]);
          devLog(`admin *** ${menuName} *** page ITEM DATA 갱신되었습니다: `, itemList, itemData);
        }
      }
    }

    const moneyResponse = await fetch(`/api/page?apitype=user_money&userid=${tokenRef.current?.user?.name}`);
    const moneyData = await moneyResponse.json();
    if (moneyData?.data?.length) {
      const money = moneyData.data[0].user_money;
      devLog(`admin *** ${menuName} *** page MONEY 갱신되었습니다: `, money);
      setMoney(money);
    }
    setUsername(tokenRef.current?.user?.name || username);
  }
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchDataEssential();
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  /* prettier-ignore */
  // useEffect(() => {
  // }, [maindata]);

  return (
    <div id="market" className="relative" style={{width: "923px", height: "353px"}}>
      <div className="relative img-market-init img-market-bg flex w-full h-full">
        <div className="relative img-market-npc flex" style={{width: "260px", height: "320px",top: "25px", left: "30px", backgroundImage: `url(${getImageUrl(npcImage)})`}}>
          <div className="absolute market_npc_banner img-market-banner" style={{width: "301px", height: "103px", bottom: "20px", left: "20px"}}>
            <span className="absolute text-white text-[16px]" style={{left: "15px"}}>
              {npcName}
            </span>
            <div className={"market_npc_text relative text-[12px] px-2 py-1 font-nexon font-bold" + npcTextColor} style={{top: "20px"}}>
              <span className={"" + npcTextColor}>
                안녕하세요 <span className="text-[#FF0050]">{username}</span>
              </span>
              {/* prettier-ignore */}
              <pre className="absolute no-scrollbar text-x-wrap" style={{width: "290px", height: "50px"}}>
                {npcText}
              </pre>
            </div>
          </div>
        </div>
        <Market userid={tokenRef.current?.user?.name} marketItems = {items} money = {money} setMoney = {(value)=>setMoney(value)}/>
        <div className="absolute market-costbox flex justify-center items-center" style={{width: "160px", height: "40px", top: "20px", right: "55px"}}>
          <span className="inline-block text-[20px] w-[160px] text-right text-line-wrap">{money}</span>
          <span className="text-[18px] text-[#ff7ea7] ml-2">AKA</span>
          <span className="absolute text-[#b094f3] w-[300px] text-right font-nexon font-bold text-[12px]" style={{top: "60px", right: "20px"}}>
            *마우스 클릭시 아이템이 구매됩니다.
          </span>
        </div>
      </div>
    </div>
  );
}
