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
  const [maindata, setMaindata] = useState({}); // 메인 데이터를 추적하는 상태
  const [patrolData, setPatrolData] = useState({}); // 메인 데이터를 추적하는 상태
  const [userdata, setUserdata] = useState(0); // 스태미나 데이터를 추적하는 상태
  const [log, setLog] = useState([]); // 로그 데이터를 추적하는 상태
  const [result, setResult] = useState({}); // 결과 데이터를 추적하는 상태

  const randomIndex = (max) => Math.floor(Math.random() * max);

  const fetchDataEssential = useCallback(async () => {
    let response = await fetch(`/api/select?apitype=${menuName}&getcount=1`);
    devLog("야 메인 땡긴다?", response, tokenRef);
    const newData = await response.json();
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다 : `, newData, newData.data[0]?.items);
      setMaindata(newData.data);
      const newMainData = newData.data[randomIndex(newData.data.length)];
      setPatrolData(newMainData);
    }
    let staminaResponse = await fetch(`/api/page/${menuName}?apitype=patrol_user&userid=${tokenRef.current?.user?.name}`);
    const staminaData = await staminaResponse.json();
    if (staminaData?.data?.length) {
      devLog(`admin *** ${menuName} page stamina data 갱신되었습니다 : `, staminaData);
      setUserdata(staminaData.data[0]);
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
  }, [maindata]);

  const checkPatrolFail = (result, userdata) => {
    const checkElement = ["atk", "def", "luk", "agi", "wis"];
    let check = true;
    for (let elem of checkElement) {
      let patrolStat = result[`patrol_${elem}`];
      devLog(`checkPatrolFail ${elem}`, patrolStat, userdata[`user_${elem}`]);
      if (!patrolStat) continue;
      patrolStat = parseInt(patrolStat);
      let userStat = parseInt(userdata[`user_${elem}`]);
      if (patrolStat > userStat) {
        check = false;
        break;
      }
    }
    devLog("checkPatrolFail", check, result);
    return check;
  };
  const nextProcess = (idx, selector = "patrol") => {
    if (!userdata) {
      alert("유저정보를 올바르게 읽지 못했습니다");
      return;
    }
    if (selector === "patrol") {
      if (idx >= 0 || idx < (patrolData?.choices?.length || 0)) {
        const user = tokenRef.current?.user?.name || null;
        const result = checkPatrolFail(patrolData, userdata)
          ? patrolData.choices[idx]
          : {
              patrol_select: patrolData.choices[idx].patrol_select,
              patrol_ret_msg: patrolData.patrol_fail_msg,
              patrol_ret_type: patrolData.patrol_fail_type,
              patrol_ret_money: patrolData.patrol_fail_money,
              patrol_ret_count: patrolData.patrol_fail_count,
              patrol_ret_img: patrolData.patrol_img_fail,
              patrol_ret_idx: idx,
            };
        const newlog = `${user}의 패트롤 선택 : ${result.patrol_select}`;
        const newRetLog = `${user}의 패트롤 결과 : ${result.patrol_ret_msg} - ${result.patrol_ret_type} ${result.patrol_ret_type === "AKA" ? result.patrol_ret_money : result.patrol_ret_count} 획득`;
        logSave(user, menuName, newlog);
        setLog([...log, {log: newlog, time: new Date().toLocaleString()}]);
        logSave(user, menuName, newRetLog);
        setLog([...log, {log: newRetLog, time: new Date().toLocaleString()}]);
        setLog([...log, {log: `현재 남은 스테미나 : ${userdata.user_stamina - 1}`, time: new Date().toLocaleString()}]);
        setResult(result);

        // 결과 데이터를 서버로 전송
        const formData = new FormData();
        formData.append("apitype", "patrol_result");
        formData.append("userid", user);
        formData.append("stamina", userdata.user_stamina - 1);
        formData.append("result", JSON.stringify({type: result.patrol_ret_type, value: result.patrol_ret_type === "AKA" ? result.patrol_ret_money : result.patrol_ret_count}));

        fetch("/api/page/patrol", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => devLog(data))
          .catch((error) => console.error("Error:", error));

        const newUserdata = {...userdata};
        newUserdata.user_stamina -= 1;
        setUserdata(newUserdata);
      }
    } else if (selector === "result") {
      const index = randomIndex(maindata.length);
      setPatrolData(maindata[index]);
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
        {isSelector ? <Selector patrol={patrolData} stamina={userdata.user_stamina} changeFunc={nextProcess} /> : <Result result={result} userdata={userdata} changeFunc={nextProcess} />}
        <LogViewer height="126px" logs={log} css={"rounded-lg mt-2"} opacity={0.8} />
      </div>
    </>
  );
}

function Selector(props) {
  const changeFunc = props.changeFunc;
  const patrol = props.patrol || null;
  const stamina = props.stamina || 0;
  return (
    <div className="img-patrol-init img-patrol-selector-bg patrol-selector relative w-full" style={{height: "275px"}}>
      {stamina ? (
        <>
          <div className="absolute patrol-selector-icon w-[140px] h-[140px]" style={{top: "75px", left: "100px"}}>
            <img src={patrol.patrol_img || "https://via.placeholder.com/500?text=Image+1"} className="w-full h-full" />
          </div>
          <div className="absolute patrol-selector-area w-[400px] h-[20px] text-[#9889FF]" style={{top: "60px", left: "290px"}}>
            <span>★ {patrol.patrol_name || "관리자에게 문의하세요"}</span>
          </div>
          <div className="absolute patrol-selector-text w-[440px] font-nexon text-white" style={{top: "90px", left: "290px"}}>
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
          </div>
        </>
      ) : (
        <>
          <div className="absolute patrol-selector-area w-[400px] h-[20px] text-[#9889FF]" style={{top: "60px", left: "290px"}}>
            <span>★ 스태미나가 고갈되었습니다 ★</span>
          </div>
          <div className="absolute patrol-selector-text w-[440px] font-nexon text-white" style={{top: "90px", left: "290px"}}>
            <span className="font-bold">[고갈] </span>
            <p className="h-[55px] overflow-y-hidden no-scrollbar">게임은 다음날 가능합니다</p>
          </div>
        </>
      )}
    </div>
  );
}

function Result(props) {
  const changeFunc = props.changeFunc;
  const data = props.result || null;
  return (
    <div className="img-patrol-init img-patrol-result-bg patrol-result relative w-full" style={{height: "275px"}}>
      <div className="absolute patrol-result-icon w-[100px] h-[100px]" style={{top: "65px", left: "369px"}}>
        <img src={data?.patrol_ret_img || "https://via.placeholder.com/500?text=Image+1"} className="w-full h-full" />
      </div>
      <div className="absolute patrol-result-text w-[500px] h-[20px] text-center text-[#494EAF] text-line-warp" style={{top: "195px", left: "170px"}}>
        <span>{data?.patrol_ret_msg || "장애가 발생했습니다. 관리자에게 연락하세요"}</span>
      </div>
      <div className="absolute patrol-result-text2 w-[500px] h-[20px] text-center text-[#FF9DBC] text-line-warp" style={{top: "235px", left: "170px"}}>
        <span>
          ★ <span className="text-white">{data?.patrol_ret_type && data.patrol_ret_type === "AKA" ? (data.patrol_ret_money || 0) + " 아카" : `에고 ${data.patrol_ret_count}개`}</span> 를 획득했습니다!
        </span>
      </div>
      <div className="absolute patrol-result-stamina flex flex-row justify-center w-[140px] h-[30px] text-[#2D3458]" style={{top: "55px", right: "55px"}}>
        <span>스태미나</span> <span className="text-[#D13586] patrol-result-remain ml-2">{props?.userdata?.user_stamina || 0}&nbsp;</span> <span>/ 5</span>
      </div>
      <button className="absolute patrol-result-next img-patrol-init img-patrol-result-next" style={{top: "90px", right: "40px"}} onClick={() => changeFunc(data.patrol_ret_idx, "result")}></button>
    </div>
  );
}
