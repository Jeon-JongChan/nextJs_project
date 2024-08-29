"use client";
import {useState} from "react";
import AddUser from "./AddUser";
import ListItem from "/_custom/components/_common/ListItem";

export default function Home() {
  const tabList = ["계정추가", "다른거"];
  const [activeTab, setActiveTab] = useState(tabList[0]);
  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-4">
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
            <ListItem />
          </div>
          <AddUser />
        </div>
      )}
      {activeTab === tabList[1] && <AddUser apitype={"test"} />}
      {activeTab === tabList[2] && <AddUser apitype={"test"} />}
    </div>
  );
}
