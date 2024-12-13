"use client";
import {useState, useEffect} from "react";
import BattleSelector from "./BattleSelector";
import {devLog} from "@/_custom/scripts/common";

const menuName = "battle";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  let fetchIndex = 0;
  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response = await fetch(`/api/select?apitype=page&getcount=1&pagename=${menuName}&getcount=1`);
    devLog("야 메인 땡긴다?", response);
    const newData = await response.json();
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다(${fetchIndex}): `, newData);
      setMainData([...newData.data]);
    }
  }
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <BattleSelector maindata={maindata} />
    </>
  );
}
