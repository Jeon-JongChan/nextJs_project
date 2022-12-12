/* next Module */
import Nav from "/page_components/Nav";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import BoilerplateInput from "./BoilerplateInput";
import BoilerplateList from "./BoilerplateList";
import { LocalDataContext, AdminSyncContext } from "/page_components/MyContext";
import { useContext, useEffect, useRef } from "react";
import { initAutoComplete } from "/scripts/client/autoComplete";
import { changeTab, syncData, updateCheck, submitAdminData, submitAdminDelete } from "/scripts/client/client";
import { asyncInterval, devLog } from "/scripts/common";
// * react
export default function Layout() {
    let localData = useContext(LocalDataContext);
    let adminSync = useContext(AdminSyncContext);
    let originData = useRef({});
    // let adminSync = useRef();

    const target = "boilerplate";
    const pageList = ["리서치", "야생배틀", "로드배틀"];
    const boilerplateType = {
        상용구: "boilerplate",
        조우실패문구: "researchFail",
    };

    let syncTime = 60;

    useEffect(() => {
        setTimeout(init, 1000);
    }, []);

    function init() {
        if (!adminSync.interval) {
            adminSync.interval = new asyncInterval(async () => {
                devLog(localData);
                syncBoilerplate();
            }, syncTime);
            adminSync.interval.start();
            adminSync.sync = syncBoilerplate;
        }
    }

    async function syncBoilerplate(caller = null) {
        if (caller) devLog("syncBoilerplate : ", caller);
        originData.current = await syncData(target, originData.current || {}, "Admin syncDataInterval");
        // 데이터를 무작정 넣기전에 업데이트가 있었는지 확인
        devLog("adminSync", originData.current, localData);
        if (updateCheck(originData.current.status, localData.status, "AdminBoilerplate syncData")) {
            // 데이터를 업데이트 해야한다면 초기화 작업 진행
            Object.values(boilerplateType).forEach((element) => {
                localData[element] = [];
            });
            localData.status = Object.assign({}, originData.current.status);
            originData.current.data?.forEach((element) => {
                // if (!localData[boilerplateType[element.TYPE]]) localData[boilerplateType[element.TYPE]] = [];
                localData[boilerplateType[element.TYPE]].push(element);
            });
        }
    }

    return (
        <>
            <Nav></Nav>
            <div className="mt-2">
                <ul className="flex items-center justify-center space-x-4">
                    <button onClick={() => changeTab("#adminpage-addBoilerplate")}>
                        <li className="apply-tab-item">페이지별 상용구</li>
                    </button>
                    <button onClick={() => changeTab("#adminpage-addFailtext")}>
                        <li className="apply-tab-item">페이지별 실패문구</li>
                    </button>
                </ul>
            </div>
            <div id="adminpage-addBoilerplate" className="activate-tab">
                <div className="flex mt-4">
                    <div className="flex flex-col w-3/5">
                        <BoilerplateList></BoilerplateList>
                    </div>
                    <form className="flex flex-row w-2/5">
                        <BoilerplateInput pageList={pageList}></BoilerplateInput>
                    </form>
                </div>
            </div>
            <div id="adminpage-addFailtext" className="hidden">
                <div className="flex mt-4">
                    <div className="flex flex-col w-3/5">
                        <BoilerplateList tabType={boilerplateType["조우실패문구"]} uniquetag={"i2-"} syncTime={3}></BoilerplateList>
                    </div>
                    <form className="flex flex-row w-2/5">
                        <BoilerplateInput pageList={[pageList[0]]} type={"조우실패문구"} uniquetag={"i2-"}></BoilerplateInput>
                    </form>
                </div>
            </div>
        </>
    );
}
