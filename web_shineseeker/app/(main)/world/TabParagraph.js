"use client";
import {useState, useEffect} from "react";

export default function Component(props) {
  const [activeTab, setActiveTab] = useState(1);
  const [tabContent, setTabContent] = useState({});
  const clickTab = (target, tab) => {
    // 기존 active tab 정상화
    const activeTab = document.querySelector(".img-world-tab-active");
    if (activeTab) {
      activeTab.classList.remove("img-world-tab-active");
      // activeTab.classList.remove("img-world-tab-col" + activeTab.dataset.key + "-active");
      // activeTab.classList.add("img-world-tab-col" + activeTab.dataset.key);
    }
    // 클릭한 tab 활성화
    // target.classList.remove("img-world-tab-col" + tab);
    // target.classList.add("img-world-tab-col" + tab + "-active");
    target.classList.add("img-world-tab-active");
    setActiveTab(parseInt(tab));
  };
  const TabContent = ({tab}) => {
    const className = "w-full h-full max-h-[320px] text-white text-x-wrap";
    return <pre className={className}>{tabContent?.[tab - 1]}</pre>;
  };

  useEffect(() => {
    if (props?.tabContent) setTabContent(props.tabContent);
    console.log("TabParagraph props:", props);
  }, [props]);

  const tabTextCss = "hover:text-[#806FAF] focus:text-[#806FAF] ";
  return (
    <>
      <div className="flex flex-col rounded-3xl" style={{width: "620px", height: "320px"}}>
        <div className="grid grid-cols-5 w-full relative text-white" style={{height: "32px", top: "0px"}}>
          <button className={tabTextCss + "col-span-1 img-world-tab-active"} data-key={1} onClick={(e) => clickTab(e.target, 1)}>
            ★세계
          </button>
          <button className={tabTextCss + "col-span-1"} data-key={2} onClick={(e) => clickTab(e.target, 2)}>
            ★샤인시커
          </button>
          <button className={tabTextCss + "col-span-1"} data-key={3} onClick={(e) => clickTab(e.target, 3)}>
            ★포텐셜
          </button>
          <button className={tabTextCss + "col-span-1"} data-key={4} onClick={(e) => clickTab(e.target, 4)}>
            ★시커하운트
          </button>
          <button className={tabTextCss + "col-span-1"} data-key={5} onClick={(e) => clickTab(e.target, 5)}>
            ★사도
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pl-4 py-4 pr-2 text-m img-world-tab-bg">
          <TabContent tab={activeTab} />
        </div>
      </div>
    </>
  );
}
