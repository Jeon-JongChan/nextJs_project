"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import {useState, useEffect} from "react";
import AdminTabUser from "./AdminTabUser";
import AdminTabSkill from "./AdminTabSkill";

export default function Home() {
  const tabList = ["유저관리", "직업", "몬스터", "스펠", "아이템", "레이드", "패트롤"];
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
    <div className="flex flex-col w-full">
      <div className="flex justify-center mb-4 w-full">
        {tabList.map((tab, index) => {
          return (
            <button key={index} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 border-gray-500"}`}>
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === tabList[0] && <AdminTabUser />}
      {activeTab === tabList[3] && <AdminTabSkill apitype={"skill"} />}
    </div>
  );
}
