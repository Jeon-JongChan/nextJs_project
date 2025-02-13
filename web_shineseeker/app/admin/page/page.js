"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import {useState, useEffect} from "react";
import AdminPageMain from "./AdminPageMain";
import AdminPageWorld from "./AdminPageWorld";
import AdminPageRead from "./AdminPageRead";
import AdminPageMarket from "./AdminPageMarket";
import AdminPageBattle from "./AdminPageBattle";
import AdminPageRaid from "./AdminPageRaid";

export default function Home() {
  const tabList = ["메인화면", "세계관", "필독", "교환소", "배틀", "레이드방관리"];
  const [activeTab, setActiveTab] = useState(tabList[0]);

  useEffect(() => {
    let fetchIndex = 0;
    // 데이터를 주기적으로 가져오기 위한 함수
    async function fetchData() {}

    // 5초마다 데이터를 가져옴
    const intervalId = setInterval(fetchData, 5000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col w-full min-w-[1400px]">
      <div className="flex justify-center mb-4 w-full">
        {tabList.map((tab, index) => {
          return (
            <button key={index} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 border-gray-500"}`}>
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === tabList[0] && <AdminPageMain />}
      {activeTab === tabList[1] && <AdminPageWorld />}
      {activeTab === tabList[2] && <AdminPageRead />}
      {activeTab === tabList[3] && <AdminPageMarket />}
      {activeTab === tabList[4] && <AdminPageBattle />}
      {activeTab === tabList[5] && <AdminPageRaid />}
    </div>
  );
}
