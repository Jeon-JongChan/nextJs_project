/* next Module */
import { changeTab, syncData } from "/scripts/client/client";
import { asyncInterval, devLog } from "/scripts/common";
import Nav from "/page_components/Nav";
import BattleResearch from "./BattleResearch";
import BattleWildbattle from "./BattleWildbattle";
import BattleRoadbattle from "./BattleRoadbattle";
import { LocalDataContext } from "/page_components/MyContext";
import { useContext, useEffect, useRef, useState } from "react";
// * react
export default function Layout() {
    let localData = useContext(LocalDataContext);
    let syncDataInterval;

    useEffect(() => {
        setTimeout(initBattle, 1000);
    }, []);

    function syncDataBattle() {
        let syncList = ["poketmon", "local"];
        devLog("Battle syncDataBattle", localData);
        try {
            syncList.forEach(async (element) => {
                localData[element] = await syncData(element, localData?.[element] || {}, "Battle syncDataInterval");
            });
        } catch (e) {
            devLog("Battle syncDataInterval error. localData :", localData, e.message);
        }
    }

    function initBattle() {
        syncDataInterval = new asyncInterval(syncDataBattle, 60);
        syncDataInterval.start();
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
                        <li className="apply-tab-item">야생배틀</li>
                    </button>
                    <button onClick={() => changeTab("#battlepage-roadbattle")}>
                        <li className="apply-tab-item">로드배틀</li>
                    </button>
                </ul>
            </div>
            <BattleResearch isActive={"hidden"}></BattleResearch>
            <BattleWildbattle isActive={"hidden"}></BattleWildbattle>
            <BattleRoadbattle></BattleRoadbattle>
        </>
    );
}
