"use client";
import {useState} from "react";
import Image from "next/image";
import TabStatus from "./TabStatus";
import TabInventory from "./TabInventory";

export default function Component({params}) {
  const [selectedTab, setSelectedTab] = useState(1);
  const images = ["https://via.placeholder.com/500?text=Image+1", "https://via.placeholder.com/500?text=Image+2", "https://via.placeholder.com/500?text=Image+3"];
  const contents = [
    <TabStatus />,
    <TabInventory />,
    <div key="3">
      <h2 className="text-lg font-bold">내용 3</h2>
      <p>탭 3에 대한 내용입니다.</p>
    </div>,
  ];
  return (
    <>
      <div className="flex justify-between space-x-4">
        <div className="w-3/5">
          <img src={images[selectedTab - 1]} alt={`Image ${selectedTab}`} className="w-full h-auto" />
        </div>
        <div className="w-2/5 space-y-4 ">
          <div className="flex">
            {[1, 2, 3].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`block w-full px-4 py-2 border ${selectedTab === tab ? "border-black" : "border-gray-300"} text-left`}
              >
                탭 {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">{contents[selectedTab - 1]}</div>
        </div>
      </div>
    </>
  );
}
