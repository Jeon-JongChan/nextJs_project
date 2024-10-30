"use client";
import {useState, useEffect} from "react";

export default function Component(props) {
  const [activeTab, setActiveTab] = useState("1");
  const [tabContent, setTabContent] = useState({});
  const clickTab = (target, tab) => {
    console.log(target, target.dataset);
    // 기존 active tab 정상화
    const activeTab = document.querySelector(".img-read-tab-active");
    if (activeTab) {
      activeTab.classList.remove("img-read-tab-active");
      // activeTab.classList.remove("img-read-tab-col" + activeTab.dataset.key + "-active");
      // activeTab.classList.add("img-read-tab-col" + activeTab.dataset.key);
    }
    // 클릭한 tab 활성화
    target.classList.remove("img-read-tab-col" + tab);
    // target.classList.add("img-read-tab-col" + tab + "-active");
    // target.classList.add("img-read-tab-active");
    setActiveTab(tab);
  };
  const TabContent = ({tab}) => {
    const className = "w-full h-full text-white max-h-[480px] text-x-wrap";
    return <pre className={className}>{tabContent?.[tab - 1]}</pre>;
  };
  useEffect(() => {
    if (props?.tabContent) setTabContent(props.tabContent);
    console.log("TabParagraph props:", props);
  }, [props]);

  const tabTextCss = "hover:text-[#806FAF] focus:text-[#806FAF] ";
  return (
    <>
      <div className="flex rounded-3xl px-4" style={{height: "inherit", borderRadius: "3rem"}}>
        <div className="" style={{minWidth: "125px", height: "inherit"}}>
          <div className="grid grid-cols-1 relative h-full text-white">
            <button className={tabTextCss + "col-span-1 img-read-tab-active"} data-key={1} onClick={(e) => clickTab(e.target, 1)}>
              ★커뮤니티
            </button>
            <button className={tabTextCss + "col-span-1"} data-key={2} onClick={(e) => clickTab(e.target, 2)}>
              ★로그 작성 기준
            </button>
            <button className={tabTextCss + "col-span-1"} data-key={3} onClick={(e) => clickTab(e.target, 3)}>
              ★러닝 시 유의사항
            </button>
            <button className={tabTextCss + "col-span-1"} data-key={4} onClick={(e) => clickTab(e.target, 4)}>
              ★주의사항
            </button>
            <button className={tabTextCss + "col-span-1"} data-key={5} onClick={(e) => clickTab(e.target, 5)}>
              ★하차 및 제명
            </button>
          </div>
        </div>
        <div className="img-read-tab-bg" style={{width: "780px", height: "375px"}}>
          <div className="flex-1 overflow-y-auto pl-8 py-4 text-m" style={{width: "780px", height: "375px"}}>
            <TabContent tab={activeTab} />
          </div>
        </div>
      </div>
    </>
  );
}
