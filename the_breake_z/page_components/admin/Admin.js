/* next Module */
import Nav from "/page_components/Nav";
import ImageLayerText from "/page_components/public/ImageLayerText";
import PoketmonInput from "/page_components/admin/PoketmonInput";
import PersonalityInput from "/page_components/admin/PersonalityInput";
import ListItem from "/page_components/public/ListItem";
import LocalInput from "/page_components/admin/LocalInput";
import SpecInput from "/page_components/admin/SpecInput";
import {useEffect, useState, useContext, useRef} from "react";
import {LocalDataContext, HostContext, AdminSyncContext, AdminSyncDataContext} from "/page_components/MyContext";
import {changeTab, syncData, syncDataNoCheck, updateCheck} from "/scripts/client/client";
import {devLog, asyncInterval} from "/scripts/common";
// * react
export default function Layout() {
  let localData = useContext(LocalDataContext);
  let host = useContext(HostContext);
  const adminSync = useContext(AdminSyncContext);
  const adminSyncData = useContext(AdminSyncDataContext);

  let [images, setImages] = useState([]);
  let [locals, setLocals] = useState([]);
  let [specs, setSpecs] = useState([]);
  let [personailies, setPersonailies] = useState([]);
  const syncDataList = adminSyncData.current;
  // const syncDataList = {
  //     poketmon: [],
  //     local: [],
  //     spec: [],
  //     personality: [],
  // };
  let syncInterval = useRef();
  let syncNoCheckInterval = useRef();
  let syncCheckInterval;
  let syncTime = 60;
  let syncNoCheckTime = 600;

  useEffect(() => {
    setTimeout(initAdmin, 1000);
  }, []);

  async function initState() {
    let syncList = ["local", "personality", "spec"];
    // devLog("Battle syncDataBattle", localData);
    try {
      syncList.forEach(async (element) => {
        let frameNode = document.querySelector("." + element + "-list");
        frameNode.setAttribute("data-cnt", 0);
        frameNode.setAttribute("data-lastid", 0);
        frameNode.setAttribute("data-updatedt", "");
        syncDataList[element] = [];
      });

      setLocals([]);
      setSpecs([]);
      setPersonailies([]);
    } catch (e) {
      devLog("initState error", e.message);
    }
  }

  function initAdmin() {
    if (syncInterval.current !== {}) {
      syncInterval.current = new asyncInterval(() => {
        syncList("poketmon");
        syncList("local");
        syncList("spec");
        syncList("personality");
        syncDataAdmin();
      }, syncTime);
      syncInterval.current.start();
    }
    if (syncNoCheckInterval.current !== {}) {
      syncNoCheckInterval.current = new asyncInterval(async () => {
        devLog("syncNoCheckInterval. syncNoCheckTime : ", syncNoCheckTime);
        await initState();
        await syncDataAdmin(false);
      }, syncNoCheckTime);
      syncNoCheckInterval.current.start();
    }
    /**
     * 2초마다 새로운 입력 및 삭제가 있는 경우 해당 데이터를 동기화하고 화면에 보여준다
     * 다만 데이터 동기화가 오래걸릴 경우 시간 간격이 늘어 날 수 있다.
     */
    if (!syncCheckInterval) {
      syncCheckInterval = new asyncInterval(async () => {
        // devLog("syncCheckInterval : ", adminSync.current);
        if (adminSync.current !== "") {
          let target = adminSync.current;
          devLog("syncCheckInterval Change: ", target);
          adminSync.current = "";
          await syncList(target, "syncCheckInterval");
        }
      }, 2);
      syncCheckInterval.start();
    }
  }
  function syncDataAdmin(isCheck = true) {
    let syncList = ["poketmon", "local", "personality", "spec"];
    // devLog("Battle syncDataBattle", localData);
    try {
      syncList.forEach(async (element) => {
        if (isCheck) localData[element] = await syncData(element, localData?.[element] || {}, "Admin syncDataInterval");
        else localData[element] = await syncDataNoCheck(element, localData?.[element] || {}, "Admin syncDataInterval");
      });
    } catch (e) {
      devLog("Admin syncDataInterval error. localData :", localData, e.message);
    }
  }
  /**
   * 포켓몬 추가탭에 나오는 이미지를 클릭할 경우 정보를 오른쪽에 표기해주는 클릭이벤트
   * @param {*} e 이벤트
   */
  async function clickPoketmonList(e) {
    let name = e.target.getAttribute("alt");
    localData.poketmon = await syncData("poketmon", localData.poketmon, "clickPoketmonList");
    let inputData = localData.poketmon.data.filter((data) => {
      if (data.NAME == name) return true;
      return false;
    })[0];

    let inputNameList = ["name", "personality", "local", "rare", "spec1", "spec2", "spec3", "levelmin", "levelmax"];
    let dataNameObject = {
      name: "NAME",
      personality: "PERSONALITY",
      local: "LOCAL",
      rare: "RARE",
      spec1: "SPEC1",
      spec2: "SPEC2",
      spec3: "SPEC3",
      levelmin: "LEVEL_MIN",
      levelmax: "LEVEL_MAX",
    };
    let inputs = document.querySelectorAll(".poketmoninput-frame input");
    devLog("clickPoketmonList", inputData);
    for (let input of inputs) {
      for (let inputName of inputNameList) {
        if (input.id === "i-" + inputName) {
          input.value = inputData[dataNameObject[inputName]];
        }
      }
    }
  }
  /**
   * 데이터를 계속 갱신해서 보여준다.
   */
  async function syncList(target = "poketmon", caller = "") {
    //document 가 없는 경우는 서버사이드 렌더링이므로 무시
    if (typeof document === "undefined") {
      devLog("syncList - document is undefined.");
      return;
    }
    let frameNode;
    let targetTag;
    let checkData;
    let syncDataStatus;

    try {
      frameNode = document.querySelector("." + target + "-list");
      targetTag = "";
      // devLog(caller + "syncList target : ", target);
      if (target === "poketmon") targetTag = "img";
      else if (target === "local") targetTag = "div";
      else if (target === "spec") targetTag = "div";
      else if (target === "personality") targetTag = "div";

      if (!frameNode) {
        devLog("syncList frameNode : " + target + "-list is not found");
        return null;
      }
      localData[target] = await syncData(target, localData[target] || {}, "syncList : " + target);

      checkData = {};
      checkData.cnt = Number(frameNode.getAttribute("data-cnt"));
      checkData.lastid = Number(frameNode.getAttribute("data-lastid"));
      checkData.update_dt = frameNode.getAttribute("data-updatedt");

      syncDataStatus = localData[target].status;
    } catch (e) {
      devLog("syncList error : ", e.message, " document typeof : ", typeof document);
    }

    // 삭제된 정보가 있을경우 리스트에서 삭제해준다.
    syncDataList[target] = syncDataList[target].filter((v1, idx) => {
      let deleteCheck = false;
      localData[target].data.forEach((v2, idx) => {
        if (v1.NAME === v2.NAME) {
          // if (target === "poketmon") devLog("status : ", v1.NAME === v2.NAME, "v1.NAME : ", v1.NAME, "v2.NAME", v2.NAME);
          deleteCheck = true;
        }
      });
      return deleteCheck;
    });

    if (updateCheck(syncDataStatus, checkData, "syncList : " + target)) {
      let listItems = frameNode.querySelectorAll(targetTag);
      let addData = localData[target].data.filter((data, idx) => {
        // devLog("syncPoketmonList map : ", data, listItems);
        let name = data.NAME;
        let addCheck = true;

        // 정보 업데이트를 대비한 정보 업데이트
        syncDataList[target].forEach((v, idx) => {
          if (v.NAME === data.NAME) syncDataList[target][idx] = data;
        });

        for (let v of listItems) {
          let alt = v.dataset.name;
          if (alt === name) {
            addCheck = false;
            break;
          }
        }

        if (addCheck) {
          return data;
        }
      });
      // if (target === "poketmon") devLog("syncList : ", target, " add data : ", ...addData, " syncDataList : ", syncDataList, " images : ", images);
      if (addData) {
        // 아무래도 js 밖에서 돌리다 보니 제대로된 저장이 안되는 느낌
        syncDataList[target] = [...syncDataList[target], ...addData];
        if (target === "poketmon") setImages([...syncDataList[target]]);
        else if (target === "local") setLocals([...syncDataList[target]]);
        else if (target === "spec") setSpecs([...syncDataList[target]]);
        else if (target === "personality") setPersonailies([...syncDataList[target]]);
        frameNode.setAttribute("data-cnt", syncDataStatus.cnt);
        frameNode.setAttribute("data-lastid", syncDataStatus.lastid);
        frameNode.setAttribute("data-updatedt", syncDataStatus.update_dt);
      }
    }
  }

  return (
    <>
      <Nav></Nav>
      <div className="mt-2">
        <ul className="flex items-center justify-center space-x-4">
          <button onClick={() => changeTab("#adminpage-addPoketmon")}>
            <li className="apply-tab-item">포켓몬 추가</li>
          </button>
          <button onClick={() => changeTab("#adminpage-addPersonality")}>
            <li className="apply-tab-item">포켓몬 성격</li>
          </button>
          <button onClick={() => changeTab("#adminpage-addLocal")}>
            <li className="apply-tab-item">포켓몬 지역</li>
          </button>
          <button onClick={() => changeTab("#adminpage-addSpec")}>
            <li className="apply-tab-item">포켓몬 특성</li>
          </button>
        </ul>
      </div>
      <div id="adminpage-addPoketmon" className="hidden">
        <div className="flex mt-4">
          <div className="flex flex-col w-2/4">
            <div className="bg-white">
              <div className="mx-auto py-4 px-4">
                <h2 className="sr-only">Products</h2>

                <div className="poketmon-list grid grid-cols-1 gap-y-10 gap-x-6 h-screen overflow-y-auto scrollbar-remove" data-cnt={0} data-lastid={0} data-updatedt={""}>
                  {images.length > 0
                    ? images.map((data, idx, array) => {
                        //   devLog("poketmonImages data : ", data, array);
                        return <ImageLayerText key={idx} optimize={false} imageSrc={data.PATH} imageAlt={data.NAME} onclick={clickPoketmonList}></ImageLayerText>;
                      })
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <form className="flex flex-row w-2/4">
            <PoketmonInput></PoketmonInput>
          </form>
        </div>
      </div>
      <div id="adminpage-addPersonality" className="hidden">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5">
            <div className="bg-white">
              <div className="mx-auto py-2 px-4">
                <h2 className="sr-only">Products</h2>
                <div
                  className="personality-list grid gap-y-1 gap-x-6 max-h-screen min-w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  data-cnt={0}
                  data-lastid={0}
                >
                  {personailies.length > 0 ? personailies.map((data, idx, array) => <ListItem key={idx} label={data.NAME} count={data.POKETMON_CNT}></ListItem>) : ""}
                </div>
              </div>
            </div>
          </div>
          <form className="flex flex-row w-2/5">
            <PersonalityInput></PersonalityInput>
          </form>
        </div>
      </div>
      <div id="adminpage-addLocal" className="activate-tab">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5">
            <div className="bg-white">
              <div className="mx-auto py-2 px-4">
                <h2 className="sr-only">Products</h2>
                <div className="local-list grid gap-y-1 gap-x-6 max-h-screen min-w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-cnt={0} data-lastid={0}>
                  {locals.length > 0 ? locals.map((data, idx, array) => <ListItem key={idx} label={data.NAME} count={data.POKETMON_CNT}></ListItem>) : ""}
                </div>
              </div>
            </div>
          </div>
          <form className="flex flex-row w-2/5">
            <LocalInput></LocalInput>
          </form>
        </div>
      </div>
      <div id="adminpage-addSpec" className="hidden">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5">
            <div className="bg-white">
              <div className="mx-auto py-2 px-4">
                <h2 className="sr-only">Products</h2>
                <div className="spec-list grid gap-y-1 gap-x-6 max-h-screen min-w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-cnt={0} data-lastid={0}>
                  {specs.length > 0 ? specs.map((data, idx, array) => <ListItem key={idx} label={data.NAME} count={data.POKETMON_CNT}></ListItem>) : ""}
                </div>
              </div>
            </div>
          </div>
          <form className="flex flex-row w-2/5">
            <SpecInput></SpecInput>
          </form>
        </div>
      </div>
    </>
  );
}
