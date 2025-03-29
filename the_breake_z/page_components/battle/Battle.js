/* next Module */
import Nav from "/page_components/Nav";
import BattleResearch from "./NewBattleResearch";
import BattleWildbattle from "./NewBattleWildbattle";
// import BattleResearch from "./BattleResearch";
// import BattleWildbattle from "./BattleWildbattle";
// import BattleRoadbattle from "./BattleRoadbattle";
import {LocalDataContext} from "/page_components/MyContext";
import {useContext, useEffect, useRef, useState} from "react";
import {changeTab, syncData, updateCheck} from "/scripts/client/client";
import {asyncInterval, devLog} from "/scripts/common";
// * react
export default function Layout() {
  let localData = useContext(LocalDataContext);
  let syncDataInterval;
  let initState = true;

  useEffect(() => {
    setTimeout(initBattle, 1000);
  }, [localData]);

  async function initBattle() {
    if (initState) {
      syncDataInterval = new asyncInterval(syncDataBattle, 60);
      syncDataInterval.start();

      // boilerplate 는 딱 한번만 호출
      if (!localData.boilerplate) localData.boilerplate = {};
      let originBoilerplate = {};
      originBoilerplate = await syncData("boilerplate", originBoilerplate, "Battle syncDataInterval");

      localData.boilerplate.status = Object.assign({}, originBoilerplate.status);
      // 데이터를 업데이트 해야한다면 초기화 작업 진행. page 별로 구분해서 넣어준다
      let boilerplatePage = {
        // 리서치: "research",
        // 야생배틀: "wildbattle",
        // 로드배틀: "roadbattle",
        리서치왼쪽: "researchLeft",
        리서치오른쪽: "researchRight",
        배틀왼쪽: "battleLeft",
        배틀오른쪽: "battleRight",
      };
      // boilerplatePage 에 있는 데이터 초기화
      Object.values(boilerplatePage).forEach((element) => {
        localData.boilerplate[element] = [];
      });
      localData.boilerplate.failtext = [];

      // 데이터 동기화 및 업데이트
      originBoilerplate.data?.forEach((element) => {
        // devLog("Battle syncDataBattle boilerplate detail", element, boilerplatePage[element.PAGE], localData.boilerplate[boilerplatePage[element.PAGE]]);
        if (element.TYPE === "조우실패문구") localData.boilerplate.failtext.push(element);
        else {
          if (localData.boilerplate[boilerplatePage[element.PAGE]]) localData.boilerplate[boilerplatePage[element.PAGE]].push(element);
        }
      });
      initState = false;
    }
  }
  /**
   * 데이터 동기화
   * @param {*} localData 동기화할 데이터
   * @param {*} boilerpalte 상용문 저장 데이터
   */
  function syncDataBattle() {
    let syncList = ["poketmon", "local", "spec"];
    try {
      syncList.forEach(async (element) => {
        localData[element] = await syncData(element, localData?.[element] || {}, "Battle syncDataInterval");
      });

      devLog("Battle syncDataBattle", localData);
    } catch (e) {
      devLog("Battle syncDataInterval error. localData :", localData, e.message);
    }
  }

  return (
    <>
      <Nav></Nav>
      <div className="mt-2">
        {/* battlepage-research, */}
        <ul className="flex items-center justify-center space-x-4">
          <button onClick={() => changeTab("#battlepage-research")}>
            <li className="apply-tab-item">리서치</li>
          </button>
          <button onClick={() => changeTab("#battlepage-wildbattle")}>
            <li className="apply-tab-item">배틀</li>
          </button>
          {/* <button onClick={() => changeTab("#battlepage-roadbattle")}>
            <li className="apply-tab-item">로드배틀</li>
          </button> */}
        </ul>
      </div>
      <BattleResearch isActive={"activate-tab"}></BattleResearch>
      <BattleWildbattle isActive={"hidden"}></BattleWildbattle>
      {/* <BattleRoadbattle isActive={"hidden"}></BattleRoadbattle> */}
    </>
  );
}
