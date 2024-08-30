"use client";
import {useState, useEffect} from "react";
import AddUser from "./AddUser";
import ListItem from "/_custom/components/_common/ListItem";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";

export default function Home() {
  const tabList = ["계정추가", "다른거"];
  const [activeTab, setActiveTab] = useState(tabList[0]);

  const [data, setData] = useState({});
  const fetchData = async () => {
    const response = await fetch("/api/select?apitype=user&getcount=1");
    const newData = await response.json();
    console.log(newData);

    setData(newData);
  };
  useEffect(() => {
    // 데이터를 주기적으로 가져오기 위한 함수
    const fetchData = async () => {
      const response = await fetch("/api/select?apitype=user");
      const newData = await response.json();
      setData(newData);
    };

    // 5초마다 데이터를 가져옴
    // const intervalId = setInterval(fetchData, 5000);

    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-4 w-full">
        {tabList.map((tab, index) => {
          return (
            <button key={index} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 border-gray-500"}`}>
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === tabList[0] && (
        <div className="flex">
          <div className="w-1/2 flex">
            <AddUser />
          </div>
          <div className="w-1/2 flex">
            <ListItem />
            <GridInputButton label={"submit"} type="submit" onclick={fetchData} />
          </div>
        </div>
      )}
      {activeTab === tabList[1] && <AddUser apitype={"test"} />}
      {activeTab === tabList[2] && <AddUser apitype={"test"} />}
    </div>
  );
}
