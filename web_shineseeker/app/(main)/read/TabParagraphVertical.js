"use client";
import {useState} from "react";

export default function Component() {
  const [activeTab, setActiveTab] = useState("1");
  const clickTab = (target, tab) => {
    console.log(target, target.dataset);
    // 기존 active tab 정상화
    const activeTab = document.querySelector(".img-read-tab-active");
    if (activeTab) {
      activeTab.classList.remove("img-read-tab-active");
      activeTab.classList.remove("img-read-tab-col" + activeTab.dataset.key + "-active");
      activeTab.classList.add("img-read-tab-col" + activeTab.dataset.key);
    }
    // 클릭한 tab 활성화
    target.classList.remove("img-read-tab-col" + tab);
    target.classList.add("img-read-tab-col" + tab + "-active");
    target.classList.add("img-read-tab-active");
    setActiveTab(tab);
  };
  const TabContent = ({tab}) => {
    switch (tab) {
      case "1":
        return <div>탭 1의 내용입니다.</div>;
      case "2":
        return <div>탭 2의 내용입니다.</div>;
      case "3":
        return <div>탭 3의 내용입니다.</div>;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="flex rounded-3xl img-read-tab-bg px-4" style={{height: "inherit", borderRadius: "3rem"}}>
        <div className="w-[13%]" style={{height: "inherit"}}>
          <div className="grid grid-cols-1 relative h-full">
            <button className="col-span-1 img-read-tab-init img-read-tab-col1" data-key={1} onClick={(e) => clickTab(e.target, "1")}></button>
            <button className="col-span-1 img-read-tab-init img-read-tab-col2" data-key={2} onClick={(e) => clickTab(e.target, "2")}></button>
            <button className="col-span-1 img-read-tab-init img-read-tab-col3" data-key={3} onClick={(e) => clickTab(e.target, "3")}></button>
            <button className="col-span-1 img-read-tab-init img-read-tab-col4" data-key={4} onClick={(e) => clickTab(e.target, "4")}></button>
            <button className="col-span-1 img-read-tab-init img-read-tab-col5" data-key={5} onClick={(e) => clickTab(e.target, "5")}></button>
          </div>
        </div>
        <div className="w-[87%]">
          <div className="flex-1 overflow-y-auto m-12 p-4">
            <TabContent tab={activeTab} />
          </div>
        </div>
      </div>
    </>
  );
}
