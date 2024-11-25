"use client";
import Image from "next/image";
import {useState, useEffect, useCallback} from "react";
import {devLog} from "@/_custom/scripts/common";
import LogViewer from "@/_custom/components/LogViewer";
import {logSave} from "@/_custom/scripts/client";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정

const menuName = "patrol";
export default function Component() {
  const {tokenRef} = useAuth() || {}; // handleLogin 가져오기
  const [isSelector, setIsSelector] = useState(true); // 텍스트가 접혀있는지 여부를 추적하는 상태
  const [mainData, setMainData] = useState({}); // 메인 데이터를 추적하는 상태
  const [patrolItem, setPatrolItem] = useState({}); // 패트롤 아이템 데이터를 추적하는 상태
  const [log, setLog] = useState([{msg: "로그1"}, {level: "critical", msg: "로그2"}, {msg: "로그3"}]); // 로그 데이터를 추적하는 상태
  const [result, setResult] = useState({}); // 결과 데이터를 추적하는 상태

  const fetchDataEssential = useCallback(async () => {
    let response = await fetch(`/api/select?apitype=${menuName}&getcount=1`);
    devLog("야 메인 땡긴다?", response, tokenRef);
    const newData = await response.json();
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다 : `, newData, newData.data[0]?.items);
      const newMainData = newData.data[0];
      setMainData(newMainData);
    }
    let itemResponse = await fetch(`/api/page/${menuName}?apitype=patrol_item`);
    const newItemData = await itemResponse.json();
    if (newItemData?.data?.length) {
      devLog(`admin *** ${menuName} page item data 갱신되었습니다 : `, newItemData);
      const newPatrolItem = {};
      newItemData.data.forEach((item) => {
        newPatrolItem[item.item_name] = item;
      });
      setPatrolItem(newItemData.data);
    }

    let logResponse = await fetch(`/api/page?apitype=log&userid=${tokenRef.current?.user?.name}&page=${menuName}`);
    const newLogData = await logResponse.json();
    if (newLogData?.data?.length) {
      devLog(`admin *** ${menuName} page log data 갱신되었습니다 : `, newLogData);
      newLogData.data.forEach((log) => {
        log.time = new Date(log.updated).toLocaleString();
      });
      setLog(newLogData.data);
    }
  }, [mainData, patrolItem]);

  const nextProcess = (idx, selector = "patrol") => {
    if (selector === "patrol") {
      if (idx >= 0 || idx < (mainData?.choices?.length || 0)) {
        const user = tokenRef.current?.user?.name || null;
        const newlog = `${user}의 패트롤 선택 : ${mainData.choices[idx].patrol_select}`;
        setLog([...log, {log: newlog, time: new Date().toLocaleString()}]);
        setResult(mainData.choices[idx]);
      }
    }
    setIsSelector(!isSelector);
  };

  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchDataEssential();
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  return (
    <>
      <div className="flex flex-col w-full mt-4" style={{width: "840px", height: "600px"}}>
        {isSelector ? <Selector patrol={mainData} changeFunc={nextProcess} /> : <Result result={result} changeFunc={nextProcess} />}
        <LogViewer height="126px" logs={log} css={"rounded-lg mt-2"} opacity={0.8} />
      </div>
    </>
  );
}

function Selector(props) {
  const changeFunc = props.changeFunc;
  const patrol = props.patrol || null;
  return (
    patrol && (
      <div className="img-patrol-init img-patrol-selector-bg patrol-selector relative w-full" style={{height: "275px"}}>
        <div className="absolute patrol-selector-icon w-[140px] h-[140px]" style={{top: "75px", left: "100px"}}>
          <img src={patrol.patrol_img || "https://via.placeholder.com/500?text=Image+1"} className="w-full h-full" />
        </div>
        <div className="absolute patrol-selector-area w-[400px] h-[20px] text-[#9889FF]" style={{top: "60px", left: "290px"}}>
          <span>★ {patrol.patrol_name || "관리자에게 문의하세요"}</span>
        </div>
        <div className="absolute patrol-selector-text w-[440px] font-nexon text-white " style={{top: "90px", left: "290px"}}>
          <span className="font-bold">[{patrol.patrol_type}] </span>
          <p className="h-[55px] overflow-y-hidden no-scrollbar">{patrol.patrol_desc || "관리자에게 연락하세요"}</p>
        </div>
        <div className="absolute patrol-selector-choices w-[456px] h-[60px] text-white flex flex-row justify-between" style={{top: "175px", left: "290px"}}>
          {patrol?.choices &&
            Object.keys(patrol.choices).map((key, idx) => (
              <button key={idx} className="relative w-[130px] h-[55px] px-2 overflow-hidden" onClick={() => changeFunc(key)}>
                {patrol.choices[key].patrol_select}
              </button>
            ))}
          {/* <button className="relative w-[130px] h-[60px] px-2" onClick={() => changeFunc()}>
            지나칠 수는 없으니 나무를 탄다
          </button>
          <button className="relative w-[130px] h-[60px] px-2" onClick={() => changeFunc()}>
            911에 전화신고를 한다.
          </button>
          <button className="relative w-[130px] h-[60px] px-2" onClick={() => changeFunc()}>
            시커의 힘을 사용한다.
          </button> */}
        </div>
      </div>
    )
  );
}

function Result(props) {
  const changeFunc = props.changeFunc;
  const result = props.result || null;
  return (
    <div className="img-patrol-init img-patrol-result-bg patrol-result relative w-full" style={{height: "275px"}}>
      <div className="absolute patrol-result-icon w-[100px] h-[100px]" style={{top: "65px", left: "369px"}}>
        <img src={result?.patrol_ret_img || "https://via.placeholder.com/500?text=Image+1"} className="w-full h-full" />
      </div>
      <div className="absolute patrol-result-text w-[500px] h-[20px] text-center text-[#494EAF] text-line-warp" style={{top: "195px", left: "170px"}}>
        <span>{result?.patrol_ret_msg || "장애가 발생했습니다. 관리자에게 연락하세요"}</span>
      </div>
      <div className="absolute patrol-result-text2 w-[500px] h-[20px] text-center text-[#FF9DBC] text-line-warp" style={{top: "235px", left: "170px"}}>
        <span>
          ★ <span className="text-white">{result?.patrol_ret_type && result.patrol_ret_type === "AKA" ? (result.patrol_ret_money || 0) + " 아카" : `에고 ${result.patrol_ret_count}개`}</span> 를 획득했습니다!
        </span>
      </div>
      <div className="absolute patrol-result-stamina flex flex-row justify-center w-[140px] h-[30px] text-[#2D3458]" style={{top: "55px", right: "55px"}}>
        <span>스태미나</span> <span className="text-[#D13586] patrol-result-remain ml-2">04</span> <span>/05</span>
      </div>
      <button className="absolute patrol-result-next img-patrol-init img-patrol-result-next" style={{top: "90px", right: "40px"}} onClick={() => changeFunc(-1, "result")}></button>
    </div>
  );
}
