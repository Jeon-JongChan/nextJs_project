/* next Module */
import Nav from "/page_components/Nav";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import BoilerplateInput from "./BoilerplateInput";
import BoilerplateList from "./BoilerplateList";
import {LocalDataContext, AdminSyncContext} from "/page_components/MyContext";
import {useContext, useEffect, useRef} from "react";
import {initAutoComplete} from "/scripts/client/autoComplete";
import {changeTab, syncData, updateCheck, submitAdminData, submitAdminDelete} from "/scripts/client/client";
import {asyncInterval, devLog} from "/scripts/common";
// * react
export default function Layout() {
  let localData = useContext(LocalDataContext);
  let adminSync = useContext(AdminSyncContext);
  let originData = useRef({});
  // let adminSync = useRef();

  const target = "boilerplate";
  const pageList = ["리서치왼쪽", "리서치오른쪽", "배틀왼쪽", "배틀오른쪽"];
  const boilerplateType = {
    // 상용구: "boilerplate",
    // 조우실패문구: "researchFail",
    리서치왼쪽: "researchLeft",
    리서치오른쪽: "researchRight",
    배틀왼쪽: "battleLeft",
    배틀오른쪽: "battleRight",
  };

  const useVarList = {
    리서치왼쪽: "$$포켓몬이름1, $$포켓몬이름2, $$포켓몬이름3, $$레벨1, $$레벨2, $$레벨3, $$특성1, $$특성2, $$특성3",
    리서치오른쪽: "$$포켓몬이름1, $$포켓몬이름2, $$포켓몬이름3, $$레벨1, $$레벨2, $$레벨3, $$특성1, $$특성2, $$특성3",
    배틀왼쪽: "$$로드이름, $$로드포켓몬, $$로드공격방식, $$로드공격기술, $$캠프이름, $$캠프포켓몬, $$캠프공격방식, $$캠프공격기술, $$로드기타, $$캠프기타",
    배틀오른쪽: "$$로드이름, $$로드포켓몬, $$로드공격방식, $$로드공격기술, $$캠프이름, $$캠프포켓몬, $$캠프공격방식, $$캠프공격기술, $$로드기타, $$캠프기타",
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
        if (localData[boilerplateType[element.TYPE]]) localData[boilerplateType[element.TYPE]].push(element);
      });
    }
  }

  return (
    <>
      <Nav></Nav>
      <div className="mt-2">
        <ul className="flex items-center justify-center space-x-4">
          <button onClick={() => changeTab("#adminpage-researchLeft")}>
            <li className="apply-tab-item">리서치 왼쪽</li>
          </button>
          <button onClick={() => changeTab("#adminpage-researchRight")}>
            <li className="apply-tab-item">리서치 오른쪽</li>
          </button>
          <button onClick={() => changeTab("#adminpage-battleLeft")}>
            <li className="apply-tab-item">배틀 왼쪽</li>
          </button>
          <button onClick={() => changeTab("#adminpage-battleRight")}>
            <li className="apply-tab-item">배틀 오른쪽</li>
          </button>
        </ul>
      </div>
      {/* <div id="adminpage-addBoilerplate" className="activate-tab">
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
            </div> */}
      <div id="adminpage-researchLeft" className="activate-tab">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5">
            <BoilerplateList tabType={boilerplateType["리서치왼쪽"]} syncTime={3}></BoilerplateList>
          </div>
          <form className="flex flex-row w-2/5">
            <BoilerplateInput pageList={[pageList[0]]} type={"리서치왼쪽"} useVarList={useVarList["리서치왼쪽"]} useVarListEx={"전투준비! ▷ $$포켓몬이름1｜Lv.$$레벨1｜$$특성1"}></BoilerplateInput>
          </form>
        </div>
      </div>
      <div id="adminpage-researchRight" className="hidden">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5">
            <BoilerplateList uniquetag={"i2-"} tabType={boilerplateType["리서치오른쪽"]} syncTime={3}></BoilerplateList>
          </div>
          <form className="flex flex-row w-2/5">
            <BoilerplateInput pageList={[pageList[1]]} type={"리서치오른쪽"} uniquetag={"i2-"} useVarList={useVarList["리서치오른쪽"]} useVarListEx={"전투준비! ▷ $$포켓몬이름1｜Lv.$$레벨1｜$$특성1"}></BoilerplateInput>
          </form>
        </div>
      </div>

      <div id="adminpage-battleLeft" className="hidden">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5">
            <BoilerplateList uniquetag={"i3-"} tabType={boilerplateType["배틀왼쪽"]} syncTime={3}></BoilerplateList>
          </div>
          <form className="flex flex-row w-2/5">
            <BoilerplateInput pageList={[pageList[2]]} type={"배틀왼쪽"} uniquetag={"i3-"} useVarList={useVarList["배틀왼쪽"]} useVarListEx={"전투준비! ▷ $$포켓몬이름1｜Lv.$$레벨1｜$$특성1"}></BoilerplateInput>
          </form>
        </div>
      </div>
      <div id="adminpage-battleRight" className="hidden">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5">
            <BoilerplateList uniquetag={"i4-"} tabType={boilerplateType["배틀오른쪽"]} syncTime={3}></BoilerplateList>
          </div>
          <form className="flex flex-row w-2/5">
            <BoilerplateInput pageList={[pageList[3]]} type={"배틀오른쪽"} uniquetag={"i4-"} useVarList={useVarList["배틀오른쪽"]} useVarListEx={"전투준비! ▷ $$포켓몬이름1｜Lv.$$레벨1｜$$특성1"}></BoilerplateInput>
          </form>
        </div>
      </div>
    </>
  );
}
