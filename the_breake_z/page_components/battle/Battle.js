/* next Module */
import { changeTab, copyToClipBoard, syncData, getRandomInt, asyncInterval, sleep, findLocalDataByName } from "/scripts/client/client";
import { autoComplete, initAutoComplete } from "/scripts/client/autoComplete";
import Nav from "/page_components/Nav";
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import GridBorderBox from "/page_components/Grid/GridBorderBox";
import BattleResearch from "./BattleResearch";
import { LocalDataContext } from "/page_components/MyContext";
import { useEffect, useState } from "react";
import { useContext } from "react";
// * react
export default function Layout() {
    let localData = {};
    let syncDataInterval;

    useEffect(() => {
        setTimeout(initBattle, 1000);
    }, []);

    function syncDataBattle() {
        let syncList = ["poketmon", "local"];
        // console.log("Battle syncDataBattle", localData);
        try {
            syncList.forEach(async (element) => {
                localData[element] = await syncData(element, localData?.[element] || {}, "Battle syncDataInterval");
            });
        } catch (e) {
            console.log("Battle syncDataInterval error. localData :", localData, e.message);
        }
    }

    function initBattle() {
        syncDataInterval = new asyncInterval(syncDataBattle, 60);
        syncDataInterval.start();
    }

    return (
        <>
            <LocalDataContext.Provider value={localData}>
                <Nav></Nav>
                <div className="mt-2">
                    {/* battlepage-research, */}
                    <ul className="flex items-center justify-center space-x-4">
                        <button onClick={() => changeTab("#battlepage-research")}>
                            <li className="apply-tab-item">리서치</li>
                        </button>
                        <button onClick={() => changeTab("#adminpage-addLocal")}>
                            <li className="apply-tab-item">야생배틀</li>
                        </button>
                        <button onClick={() => changeTab("#adminpage-addSpec")}>
                            <li className="apply-tab-item">로드배틀</li>
                        </button>
                    </ul>
                </div>
                <BattleResearch></BattleResearch>
            </LocalDataContext.Provider>
        </>
    );
}

let bolierPlate = {
    research: [
        `
🗺️ [헬벳지방 타운맵] - n호 내비 로토무
- 탐색할 필드를 선택해 탐색 또는 배틀을 진행할 수 있습니다. 로토!
한 번 고른 활동은 중간에 변경할 수 없습니다. 로토!

진행 시간을 참고하여 참여해주시기 바랍니다. 로토! 
▷ 포켓몬 탐색
▷ 로드 트레이너 배틀
▷ 흔적 수색
▷ 난동 개체 탐색
        `,
        `앞으로 번 더 리서치 할 수 있어 로토! 계속할까 로토?`,
        `은(는) 도망치는 길에 운 좋게도 바닥에 떨어진 n원을 주웠다!`,
        `은(는) 을 사용했다!

…
….
…..✨

축하해 로토! 야생의 을(를) 잡았어!
배우고 있는 기술 : ｜｜｜｜

잡은 야생 포켓몬의 정보는 오늘의 모든 리서치가 종료되면 포켓몬 박스에 기입해줘, 로토!
        `,
    ],
};
