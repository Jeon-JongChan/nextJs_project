"use client";
import React, {useState, useEffect} from "react";
import TabParagraphVertical from "./TabParagraphVertical";

const menuName = "read";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [tabContent, setTabContent] = useState({});
  let fetchIndex = 0;
  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response = await fetch(`/api/select?apitype=page&getcount=1&pagename=${menuName}&getcount=1`);
    console.log("야 메인 땡긴다?", response);
    // if (fetchIndex++ == 0) response = await fetch(`/api/select?apitype=${menuName}&getcount=1`);
    // else response = await fetch(`/api/select?apitype=${menuName}`);
    const newData = await response.json();
    if (newData?.data?.length) {
      console.log(`admin *** ${menuName} *** page data 갱신되었습니다(${fetchIndex}): `, newData);
      setMainData([...newData.data]);
    }
  }
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  /* prettier-ignore */
  useEffect(() => {
    let contents = {};
    if (maindata.length) {
      contents = maindata.filter((data) => data.id.includes("_tab") && data.value).reduce((acc, cur) => {
          const key = cur.id.split("_")[2];
          acc[key] = cur.value;
          return acc;
        }, {});
      setTabContent(contents);
    }
    console.log("maindata:", contents);
  }, [maindata]);
  return (
    <>
      <div className="relative w-full" style={{height: "375px", left: "-20px"}}>
        <TabParagraphVertical tabContent={tabContent} />
      </div>
    </>
  );
}
