/* next Module */
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import SelectDropdownText from "/page_components/public/SelectDropdownText";
import {LocalDataContext} from "/page_components/MyContext";
import {useEffect, useState, useRef, useContext} from "react";
import {initAutoComplete} from "/scripts/client/autoComplete";
import {getRandomInt, asyncInterval, devLog} from "/scripts/common";
import {copyToClipBoard, clickCopyToClipBoard, findLocalDataByLocal, youtubeLink} from "/scripts/client/client";

/**
 *
 * @param {*} isActive 해당 컴포넌트의 활성화 여부
 * @returns
 */
export default function Layout(props) {
  let isActive = props?.isActive || "activate-tab"; //"hidden";
  let localData = useContext(LocalDataContext);
  let pageName = "research";
  const boilerplateSync = useRef();
  const boilerplateLeftRef = useRef(null);
  const boilerplateRightRef = useRef(null);
  const [boilerplateLeft, setBoilerplateLeft] = useState({});
  const [boilerplateRight, setBoilerplateRight] = useState({});
  const [boilerplateViewTypeLeft, setBoilerplateViewTypeLeft] = useState("list");
  const [boilerplateViewTypeRight, setBoilerplateViewTypeRight] = useState("list");

  let randFunc = useRef();
  let randTenFunc = useRef();
  let initState = true;

  useEffect(() => {
    devLog("BattleResearch useEffect", props);
    setTimeout(initResearch, 1000);
  }, []);

  function initResearch() {
    if (initState) {
      try {
        randFunc.current = new asyncInterval((node, query) => {
          node = node || document.querySelector(query);
          if (!node) return;
          node.innerText = getRandomInt(1, 100 + 1);
        }, 3);
        randTenFunc.current = new asyncInterval((node, query) => {
          node = node || document.querySelector(query);
          if (!node) return;
          node.innerText = getRandomInt(1, 20 + 1) * 10;
        }, 3);
        initAutoComplete("i-research-local", "local", localData);
        // initAutoComplete("i-research-wildname", "poketmon", localData);

        if (!boilerplateSync.current) {
          boilerplateSync.current = new asyncInterval(() => {
            devLog(pageName + " 페이지에서 전역변수로 인한 늦은 상용문구 출력을 기다리고 있습니다.");
            if (localData?.boilerplate?.["researchLeft"] && localData?.boilerplate?.["researchRight"]) {
              devLog(pageName + " 페이지에서 전역변수로 인한 늦은 상용문구 출력을 완료했습니다", localData, boilerplateLeftRef.current);
              // 깊은 복사로 참조 저장
              boilerplateLeftRef.current = localData.boilerplate.researchLeft.map((item) => ({...item}));
              boilerplateRightRef.current = localData.boilerplate.researchRight.map((item) => ({...item}));
              devLog("상용문구 출력을 테스트...", boilerplateLeftRef.current, ...boilerplateRightRef.current);
              setBoilerplateLeft([...boilerplateLeftRef.current]);
              setBoilerplateRight([...boilerplateRightRef.current]);
              boilerplateSync.current.stop();
              return null;
            }
          }, 3);
          boilerplateSync.current.start();
        }
      } catch (e) {
        devLog("BattleResearch initResearch error. localData :", localData, e.message);
      }

      initState = false;
    }
  }
  function randomResearch(poketmonInLocal, skipValues = []) {
    // 출현율에 따른 포켓몬 선택 지점
    let limit = 100; // 최대 100번 반복
    let detailData = null;
    while (limit > 0) {
      limit--;
      let tempPoketmon = poketmonInLocal[getRandomInt(0, poketmonInLocal.length)];
      if (skipValues.includes(tempPoketmon)) continue;

      let rare = tempPoketmon?.RARE;
      if (rare === "") rare = 50;
      rare = rare * 0.01;
      if (Math.random() < rare) {
        devLog("createTextResearch detailData select : ", tempPoketmon.NAME, rare, tempPoketmon.RARE, "limit : ", limit);
        detailData = tempPoketmon;
        break;
      }
    }
    if (detailData == null) {
      devLog("createTextResearch detailData not select");
      detailData = poketmonInLocal[getRandomInt(0, poketmonInLocal.length)];
    }
    return detailData;
  }

  function replaceBoilerplate(tagName, replaceValue) {
    devLog("replaceBoilerplate : ", boilerplateLeft, boilerplateRight);
    setBoilerplateLeft((prevLeft) =>
      prevLeft.map((item) => ({
        ...item,
        TEXT: item.TEXT.replaceAll(tagName, replaceValue),
      }))
    );
    setBoilerplateRight((prevRight) =>
      prevRight.map((item) => ({
        ...item,
        TEXT: item.TEXT.replaceAll(tagName, replaceValue),
      }))
    );
  }

  function createTextResearch() {
    devLog("createTextResearch", localData);
    let targetList = ["trainer", "poketmon", "spec", "level", "personality", "music"];
    let inputs = document.querySelectorAll(".research-frame input");
    let inputValues = {};
    inputs.forEach((input) => {
      inputValues[input.dataset.name] = input.value || "";
    });

    let poketmonInLocal = findLocalDataByLocal(inputValues.local, localData.poketmon?.data);
    if (!poketmonInLocal) {
      devLog("createTextResearch poketmonInLocal is null");
      return;
    }
    devLog(">>>>>>>>>>>>>>>>>>>>", boilerplateLeftRef.current);
    setBoilerplateLeft(boilerplateLeftRef.current.map((item) => ({...item})));
    setBoilerplateRight(boilerplateRightRef.current.map((item) => ({...item})));
    // 1번 포켓몬 선택
    let detailData = randomResearch(poketmonInLocal);
    // prettier-ignore
    poketmonInLocal = poketmonInLocal.filter((element) => { return element.NAME !== detailData.NAME }); //선택된 포켓몬은 제외하고 반환
    let randomSpecIdx = getRandomInt(1, 4);
    inputValues["poketmon"] = detailData?.NAME;
    inputValues["spec"] = detailData?.["SPEC" + randomSpecIdx];
    inputValues["level"] = detailData ? getRandomInt(detailData.LEVEL_MIN, detailData.LEVEL_MAX + 1) : "oo";

    replaceBoilerplate("$$포켓몬이름1", inputValues["poketmon"]);
    replaceBoilerplate("$$레벨1", inputValues["level"]);
    replaceBoilerplate("$$특성1", inputValues["spec"]);
    devLog("1번쨰 포켓몬", detailData);
    // 2번 포켓몬 선택
    let detailData2 = randomResearch(poketmonInLocal, [detailData.NAME]);
    if (!detailData2) return; // 포켓몬이 나오지 않는다면 그만 종료
    // prettier-ignore
    poketmonInLocal = poketmonInLocal.filter((element) => { return element.NAME !== detailData2.NAME }); //선택된 포켓몬은 제외하고 반환
    let randomSpecIdx2 = getRandomInt(1, 4);
    inputValues["poketmon"] = detailData2?.NAME;
    inputValues["spec"] = detailData2?.["SPEC" + randomSpecIdx2];
    inputValues["level"] = detailData2 ? getRandomInt(detailData2.LEVEL_MIN, detailData2.LEVEL_MAX + 1) : "oo";

    replaceBoilerplate("$$포켓몬이름2", inputValues["poketmon"]);
    replaceBoilerplate("$$레벨2", inputValues["level"]);
    replaceBoilerplate("$$특성2", inputValues["spec"]);
    devLog("2번쨰 포켓몬", detailData2);
    // 3번 포켓몬 선택
    let detailData3 = randomResearch(poketmonInLocal, [detailData.NAME, detailData2.NAME]);
    if (!detailData3) return; // 포켓몬이 나오지 않는다면 그만 종료
    // prettier-ignore
    poketmonInLocal = poketmonInLocal.filter((element) => { return element.NAME !== detailData3.NAME }); //선택된 포켓몬은 제외하고 반환
    let randomSpecIdx3 = getRandomInt(1, 4);
    inputValues["poketmon"] = detailData3?.NAME;
    inputValues["spec"] = detailData3?.["SPEC" + randomSpecIdx3];
    inputValues["level"] = detailData3 ? getRandomInt(detailData3.LEVEL_MIN, detailData3.LEVEL_MAX + 1) : "oo";

    replaceBoilerplate("$$포켓몬이름3", inputValues["poketmon"]);
    replaceBoilerplate("$$레벨3", inputValues["level"]);
    replaceBoilerplate("$$특성3", inputValues["spec"]);
  }

  function makeBoilerplate(boilerplate, viewType = "list") {
    if (!boilerplate.length) return null;
    return (
      <>
        {viewType == "dropdown" ? (
          <SelectDropdownText object={boilerplateRight} label={"상용구"}></SelectDropdownText>
        ) : (
          boilerplate.map((element, index) => {
            return (
              <div key={index} className="shadow rounded-md p-1 mb-1 bg-slate-300">
                <pre onClick={clickCopyToClipBoard} className="bg-white p-2 text-sm font-medium text-gray-700 overflow-x-auto scrollbar-remove" dangerouslySetInnerHTML={{__html: element.TEXT}}>
                  {/* {element.TEXT} */}
                </pre>
              </div>
            );
          })
        )}
      </>
    );
  }
  return (
    <>
      {/* prettier-ignore */}
      <div id="battlepage-research" className={isActive}>
        <div className="flex mt-4">
          <div className="flex flex-col w-1/2">
            <div className="bg-white">
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <div className="my-2">
                    <div className="shadow rounded-md">
                      <div className="bg-white px-4 py-3">
                        <div className="research-frame grid grid-cols-6 gap-6">
                          <GridInputText id={"i-research-local"} dataName={"local"} colSpan={6} label={"에리어"}></GridInputText>
                          <GridInputButton label={"생성"} type="button" onclick={createTextResearch} colSpan={6}></GridInputButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <div className="grid grid-cols-6 gap-6 my-4">
                      <GridInputButton label={"드롭다운"} buttonColor={"zinc"} onclick={() => setBoilerplateViewTypeLeft("dropdown")} colSpan={3} type="button"></GridInputButton>
                      <GridInputButton label={"리스트"} type="button" onclick={() => setBoilerplateViewTypeLeft("list")} colSpan={3}></GridInputButton>
                    </div>
                    {boilerplateLeft && makeBoilerplate(boilerplateLeft, boilerplateViewTypeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <div className="bg-white">
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <div className="my-4">
                    <div className="grid grid-cols-6 gap-6 my-4">
                      <GridInputButton label={"드롭다운"} buttonColor={"zinc"} onclick={() => setBoilerplateViewTypeRight("dropdown")} colSpan={3} type="button"></GridInputButton>
                      <GridInputButton label={"리스트"} type="button" onclick={() => setBoilerplateViewTypeRight("list")} colSpan={3}></GridInputButton>
                    </div>
                    {boilerplateRight && makeBoilerplate(boilerplateRight, boilerplateViewTypeRight)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
