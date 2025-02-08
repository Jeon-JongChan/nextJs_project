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
  const [boilerplate, setBoilerplate] = useState({});
  const [boilerplateViewType, setBoilerplateViewType] = useState("dropdown");

  const [researchImage, setResearchImage] = useState("");
  const [researchImage2, setResearchImage2] = useState("");
  const [researchImage3, setResearchImage3] = useState("");
  const [wildCaptureFirst, setWildCaptureFirst] = useState(0);
  const [wildCaptureSecond, setWildCaptureSecond] = useState(0);
  const [wildCaptureBattle, setWildCaptureBattle] = useState(0);
  const [traceRate, setTraceRate] = useState(0);
  const [traceFailText, setTraceFailText] = useState(`
    
    
    
    
    `);

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
        initAutoComplete("i-research-wildname", "poketmon", localData);

        if (!boilerplateSync.current) {
          boilerplateSync.current = new asyncInterval(() => {
            devLog(pageName + " 페이지에서 전역변수로 인한 늦은 상용문구 출력을 기다리고 있습니다.");
            if (localData?.boilerplate?.[pageName]) {
              devLog(pageName + " 페이지에서 전역변수로 인한 늦은 상용문구 출력을 완료했습니다");
              boilerplateSync.current.stop();
              setBoilerplate(localData?.boilerplate?.[pageName]);
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
      let rare = tempPoketmon.RARE;
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
    // 1번 포켓몬 선택
    let detailData = randomResearch(poketmonInLocal);
    // prettier-ignore
    poketmonInLocal = poketmonInLocal.filter((element) => { return element.NAME !== detailData.NAME }); //선택된 포켓몬은 제외하고 반환
    let randomSpecIdx = getRandomInt(1, 4);
    inputValues["poketmon"] = detailData?.NAME;
    inputValues["spec"] = detailData?.["SPEC" + randomSpecIdx];
    inputValues["level"] = detailData ? getRandomInt(detailData.LEVEL_MIN, detailData.LEVEL_MAX + 1) : "oo";

    let personalityList = localData?.personality?.data;
    if (personalityList.length > 0) {
      inputValues["personality"] = personalityList[getRandomInt(0, personalityList.length)].NAME;
    } else inputValues["personality"] = "";

    targetList.forEach((element) => {
      let targetNodes = document.querySelectorAll(".pre-research spen[data-name='" + element + "']");
      targetNodes.forEach((node) => {
        // devLog("createTextResearch targetNodes " + element, " inputValues ", inputValues, inputValues[element]);
        node.innerText = inputValues[element];
      });
    });

    setResearchImage(detailData?.PATH || "");

    // 2번 포켓몬 선택
    let detailData2 = randomResearch(poketmonInLocal, [detailData.NAME]);
    // prettier-ignore
    poketmonInLocal = poketmonInLocal.filter((element) => { return element.NAME !== detailData2.NAME }); //선택된 포켓몬은 제외하고 반환
    let randomSpecIdx2 = getRandomInt(1, 4);
    inputValues["poketmon"] = detailData2?.NAME;
    inputValues["spec"] = detailData2?.["SPEC" + randomSpecIdx2];
    inputValues["level"] = detailData2 ? getRandomInt(detailData2.LEVEL_MIN, detailData2.LEVEL_MAX + 1) : "oo";

    if (personalityList.length > 0) {
      inputValues["personality"] = personalityList[getRandomInt(0, personalityList.length)].NAME;
    } else inputValues["personality"] = "";

    targetList.forEach((element) => {
      let targetNodes = document.querySelectorAll(".pre-research2 spen[data-name='" + element + "']");
      targetNodes.forEach((node) => {
        // devLog("createTextResearch targetNodes " + element, " inputValues ", inputValues, inputValues[element]);
        node.innerText = inputValues[element];
      });
    });

    setResearchImage2(detailData2?.PATH || "");

    // 3번 포켓몬 선택
    let detailData3 = randomResearch(poketmonInLocal, [detailData.NAME, detailData2.NAME]);
    // prettier-ignore
    poketmonInLocal = poketmonInLocal.filter((element) => { return element.NAME !== detailData3.NAME }); //선택된 포켓몬은 제외하고 반환
    let randomSpecIdx3 = getRandomInt(1, 4);
    inputValues["poketmon"] = detailData3?.NAME;
    inputValues["spec"] = detailData3?.["SPEC" + randomSpecIdx3];
    inputValues["level"] = detailData3 ? getRandomInt(detailData3.LEVEL_MIN, detailData3.LEVEL_MAX + 1) : "oo";

    if (personalityList.length > 0) {
      inputValues["personality"] = personalityList[getRandomInt(0, personalityList.length)].NAME;
    } else inputValues["personality"] = "";

    targetList.forEach((element) => {
      let targetNodes = document.querySelectorAll(".pre-research3 spen[data-name='" + element + "']");
      targetNodes.forEach((node) => {
        // devLog("createTextResearch targetNodes " + element, " inputValues ", inputValues, inputValues[element]);
        node.innerText = inputValues[element];
      });
    });

    setResearchImage3(detailData3?.PATH || "");
  }
  function calCaptureRate() {
    let inputList = ["i-research-wildname", "i-research-wildhealth", "i-research-wildball"];
    let ballStat = {
      몬스터볼: 1.2,
      수퍼볼: 1.5,
      하이퍼볼: 1.8,
    };

    // inputList 에 있는 값으로 node 가져오기
    let inputNodes = [];
    inputList.forEach((element, idx) => {
      inputNodes[idx] = document.querySelector("#" + element).value;
    });
    let selectedBallStat = ballStat[inputNodes[2]] || 1.2;
    setWildCaptureFirst(50 * selectedBallStat);
    setWildCaptureSecond(25 * selectedBallStat);
    setWildCaptureBattle((100 - inputNodes[1]) * selectedBallStat);
  }
  function startTrace() {
    let failtext = localData.boilerplate?.failtext;
    let target = document.querySelector("#i-research-tracecount");
    let targetValue = parseInt(target.value);
    let rate = targetValue < 15 ? 1 + (4 * targetValue - 4) : 100;
    setTraceRate(rate);
    // devLog(" startTrace : ", traceFailText, getRandomInt(0, traceFailText.length), traceFailText[getRandomInt(0, traceFailText.length)]);
    if (failtext?.length < 1) return;
    setTraceFailText(failtext[getRandomInt(0, failtext.length)].TEXT);
  }

  function researchTag() {
    return (
      <>
        🎵:<spen data-name={"music"}>(https://youtu.be/GOLMJjIP6pY?si=Izg-4PtAehO6xH_J)</spen> <br />
        ❗️ 앗, 야생의 <spen data-name={"poketmon"}>(포켓몬)</spen> 이(가) 나타났다! Lv.<spen data-name={"level"}>(00)</spen> | [<spen data-name={"spec"}>(특성)</spen>] <br />
        ...어떻게 할까? <br />
        <br />
        ▷ 배틀한다. (포켓몬 선출) <br />
        ▷ 포획을 시도한다 <br />
        ▷ 도망친다. <br />
      </>
    );
  }
  return (
    <>
      {/* prettier-ignore */}
      <div id="battlepage-research" className={isActive}>
        <div className="flex mt-4">
          <div className="flex flex-col w-1/3">
            <div className="bg-white">
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <div className="my-2">
                    <div className="shadow rounded-md">
                      <div className="bg-white px-4 py-3">
                        <div className="research-frame grid grid-cols-6 gap-6">
                          <GridInputText id={"i-research-trainer"} dataName={"trainer"} colSpan={3} label={"트레이너"}></GridInputText>
                          <GridInputText id={"i-research-local"} dataName={"local"} colSpan={3} label={"조사지역"}></GridInputText>
                          <GridInputText id={"i-research-music"} dataName={"music"} colSpan={6} label={"유투브 음악주소"} default={"https://youtu.be/GOLMJjIP6pY?si=Izg-4PtAehO6xH_J"}></GridInputText>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-2">
                    <div className="shadow rounded-md">
                      <div className="bg-white px-4 py-3">
                        <div className="grid grid-cols-6 gap-6">
                          <GridInputButton label={"Copy"} buttonColor={"zinc"} onclick={() => copyToClipBoard(".pre-research")} colSpan={3} type="button"></GridInputButton>
                          <GridInputButton label={"생성"} type="button" onclick={createTextResearch} colSpan={3}></GridInputButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-1">
                    <div className="shadow rounded-md p-3 bg-white overflow-x-auto scrollbar-remove">
                      <pre className="pre-research">
                        {researchTag()}
                      </pre>
                      {researchImage != "" ? (
                        <div className="flex justify-center">
                          <img id="research-img" src={"/api/image?src=" + researchImage}></img>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="p-1">
                    <div className="shadow rounded-md p-3 bg-white overflow-x-auto scrollbar-remove">
                      <pre className="pre-research2">
                        {researchTag()}
                      </pre>
                      {researchImage != "" ? (
                        <div className="flex justify-center">
                          <img id="research-img" src={"/api/image?src=" + researchImage2}></img>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="p-1">
                    <div className="shadow rounded-md p-3 bg-white overflow-x-auto scrollbar-remove">
                      <pre className="pre-research3">
                        {researchTag()}
                      </pre>
                      {researchImage != "" ? (
                        <div className="flex justify-center">
                          <img id="research-img" src={"/api/image?src=" + researchImage3}></img>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3">
            <div className="bg-white">
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <div className="my-2">
                    <pre className="shadow rounded-md p-2 text-sm font-medium text-gray-700">
                      난수 생성 ( 1 ~ 100 ) <br />
                      <span onClick={clickCopyToClipBoard} id="rand" className="text-5xl text-center block">
                        0
                      </span>
                    </pre>
                    <div className="shadow rounded-md">
                      <div className="bg-white p-1">
                        <div className="grid grid-cols-6 gap-6">
                          <GridInputButton
                            label={"START"}
                            buttonColor={"zinc"}
                            onclick={() => randFunc.current.start(document.querySelector("#rand"))}
                            colSpan={3}
                            type="button"
                          ></GridInputButton>
                          <GridInputButton label={"STOP"} type="button" onclick={() => randFunc.current.stop()} colSpan={3}></GridInputButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-2">
                    <pre className="shadow rounded-md p-2 text-sm font-medium text-gray-700">
                      난수 생성 x10 ( 10 ~ 200 ) <br />
                      <span onClick={clickCopyToClipBoard} id="randTen" className="text-5xl text-center block">
                        0
                      </span>
                    </pre>
                    <div className="shadow rounded-md">
                      <div className="bg-white p-1">
                        <div className="grid grid-cols-6 gap-6">
                          <GridInputButton
                            label={"START"}
                            buttonColor={"zinc"}
                            onclick={() => randTenFunc.current.start(document.querySelector("#randTen"))}
                            colSpan={3}
                            type="button"
                          ></GridInputButton>
                          <GridInputButton label={"STOP"} type="button" onclick={() => randTenFunc.current.stop()} colSpan={3}></GridInputButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <div className="grid grid-cols-6 gap-6 my-4">
                      <GridInputButton label={"드롭다운"} buttonColor={"zinc"} onclick={() => setBoilerplateViewType("dropdown")} colSpan={3} type="button"></GridInputButton>
                      <GridInputButton label={"리스트"} type="button" onclick={() => setBoilerplateViewType("list")} colSpan={3}></GridInputButton>
                    </div>
                    {boilerplateViewType === "dropdown" && boilerplate.length > 0 ? <SelectDropdownText object={boilerplate} label={"상용구"}></SelectDropdownText> : null}
                    {boilerplateViewType === "list" && boilerplate.length > 0
                      ? boilerplate.map((element, index) => {
                          return (
                            <div key={index} className="shadow rounded-md p-1 mb-1 bg-slate-300">
                              <pre onClick={clickCopyToClipBoard} className="bg-white p-2 text-sm font-medium text-gray-700 overflow-x-auto scrollbar-remove">
                                {element.TEXT}
                              </pre>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3">
            <div className="bg-white">
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <div className="shadow rounded-md">
                    <div className="bg-white px-2 py-2">
                      <div className="research-wild-frame grid grid-cols-6 gap-6">
                        <GridInputText id={"i-research-wildname"} dataName={"name"} colSpan={3} label={"야생포켓몬 이름"}></GridInputText>
                        <GridInputText id={"i-research-wildhealth"} dataName={"health"} colSpan={3} label={"야생포켓몬 체력"}></GridInputText>
                        <GridInputSelectBox id={"i-research-wildball"} colSpan={3} label={"포켓몬 볼"} options={["몬스터볼", "수퍼볼", "하이퍼볼"]}></GridInputSelectBox>
                      </div>
                    </div>
                  </div>
                  <div className="shadow rounded-md">
                    <div className="bg-white p-1">
                      <div className="grid grid-cols-6 gap-6">
                        <GridInputButton label={"포획 확률 생성"} type="button" onclick={() => calCaptureRate()} colSpan={6}></GridInputButton>
                      </div>
                    </div>
                  </div>
                  <pre id="research-wild-capture-first" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center">
                    첫번째 시도 포획 확률 <br />
                    <span onClick={clickCopyToClipBoard} id="randTen" className="text-5xl text-center block">
                      {wildCaptureFirst}
                    </span>
                  </pre>
                  <pre id="research-wild-capture-second" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center">
                    두번째 시도 포획 확률 <br />
                    <span onClick={clickCopyToClipBoard} id="randTen" className="text-5xl text-center block">
                      {wildCaptureSecond}
                    </span>
                  </pre>
                  <pre id="research-wild-capture-battle" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center">
                    배틀 도중 포획 확률 <br />
                    <span onClick={clickCopyToClipBoard} id="randTen" className="text-5xl text-center block">
                      {wildCaptureBattle}
                    </span>
                  </pre>
                </div>
              </div>
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <div className="shadow rounded-md">
                    <div className="bg-white px-2 py-2">
                      <div className="research-trace-frame grid grid-cols-6 gap-6">
                        <GridInputText id={"i-research-tracecount"} dataName={"name"} colSpan={6} label={"흔적수색 회차"}></GridInputText>
                      </div>
                    </div>
                  </div>
                  <div className="shadow rounded-md">
                    <div className="bg-white p-1">
                      <div className="grid grid-cols-6 gap-6">
                        <GridInputButton label={"흔적 수색"} type="button" onclick={() => startTrace()} colSpan={6}></GridInputButton>
                      </div>
                    </div>
                  </div>
                  <pre id="research-trace-rate" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center">
                    조우 확률 <br />
                    <span onClick={clickCopyToClipBoard} id="randTen" className="text-5xl text-center block">
                      {traceRate}
                    </span>
                  </pre>
                  <pre id="research-trace-failtext" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center overflow-x-auto scrollbar-remove">
                    조우 실패 랜덤 문구 <br />
                    <pre onClick={clickCopyToClipBoard} id="randTen" className="text-base text-center block">
                      {traceFailText}
                    </pre>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
