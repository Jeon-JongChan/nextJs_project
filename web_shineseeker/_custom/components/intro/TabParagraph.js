"use client";
import {useState} from "react";

export default function Component() {
  const [activeTab, setActiveTab] = useState("tab1");
  const TabContent = ({tab}) => {
    switch (tab) {
      case "tab1":
        return <div>탭 1의 내용입니다.</div>;
      case "tab2":
        return <div>탭 2의 내용입니다.</div>;
      case "tab3":
        return <div>탭 3의 내용입니다.</div>;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="grid grid-cols-6 w-full">
          <button className="col-span-1" onClick={() => setActiveTab("tab1")}>
            탭 1
          </button>
          <button className="col-span-1" onClick={() => setActiveTab("tab2")}>
            탭 2
          </button>
          <button className="col-span-1" onClick={() => setActiveTab("tab3")}>
            탭 3
          </button>
          <button className="col-span-1" onClick={() => setActiveTab("tab4")}>
            탭 4
          </button>
          <button className="col-span-1" onClick={() => setActiveTab("tab5")}>
            탭 5
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <TabContent tab={activeTab} />
        </div>
      </div>
    </>
  );
}
