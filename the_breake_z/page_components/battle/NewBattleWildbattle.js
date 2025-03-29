/* next Module */
import NewBattleWildbattleSide from "./NewBattleWildbattleSide";
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import SelectDropdownText from "/page_components/public/SelectDropdownText";
import {LocalDataContext} from "/page_components/MyContext";
import {useEffect, useState, useRef, useContext} from "react";
import {initAutoComplete} from "/scripts/client/autoComplete";
import {getRandomInt, asyncInterval, devLog} from "/scripts/common";
import {copyToClipBoard, clickCopyToClipBoard, findLocalDataByName} from "/scripts/client/client";

/**
 *
 * @param {*} isActive 해당 컴포넌트의 활성화 여부
 * @returns
 */
export default function Layout(props) {
  let isActive = props?.isActive || "activate-tab"; //"hidden";
  const localData = useContext(LocalDataContext);

  let pageName = "wildbattle";
  const boilerplateSync = useRef();
  const [boilerplateLeft, setBoilerplateLeft] = useState({});
  const [boilerplateRight, setBoilerplateRight] = useState({});
  const [boilerplateViewTypeLeft, setBoilerplateViewTypeLeft] = useState("list");
  const [boilerplateViewTypeRight, setBoilerplateViewTypeRight] = useState("list");

  let initState = true;
  const attackOption = ["정면 돌파!", "빈틈 집중!", "상쇄 반격!"];

  useEffect(() => {
    init();
  }, []);

  function init() {
    if (initState) {
      try {
        initAutoComplete("i-wildbattle-first-poketmon", "poketmon", localData);
        initAutoComplete("i-wildbattle-second-poketmon", "poketmon", localData);
      } catch (e) {
        devLog("BattleWildbattle init error. localData :", localData, e.message);
      }
      initState = false;
      if (!boilerplateSync.current) {
        boilerplateSync.current = new asyncInterval(() => {
          devLog(pageName + " 페이지에서 전역변수로 인한 늦은 상용문구 출력을 기다리고 있습니다.", localData?.boilerplate, localData?.boilerplate?.[pageName], boilerplateSync.current);
          if (localData?.boilerplate?.["battleLeft"] && localData?.boilerplate?.["battleRight"]) {
            devLog(pageName + " 페이지에서 전역변수로 인한 늦은 상용문구 출력을 완료했습니다", localData);
            setBoilerplateLeft(localData?.boilerplate?.["battleLeft"]);
            setBoilerplateRight(localData?.boilerplate?.["battleRight"]);
            boilerplateSync.current.stop();
            return null;
          }
        }, 3);
        boilerplateSync.current.start();
      }
    }
  }
  function replaceBoilerplate(tagName, replaceValue) {
    let replaceList;

    replaceList = [...boilerplateLeft];
    if (!replaceList) return;
    for (let key in replaceList) {
      replaceList[key].TEXT = replaceList[key].TEXT.replaceAll(tagName, replaceValue);
    }
    devLog("replaceBoilerplate : ", boilerplateLeft, replaceList);
    setBoilerplateLeft(replaceList);

    replaceList = [...boilerplateRight];
    if (!replaceList) return;
    for (let key in replaceList) {
      replaceList[key].TEXT = replaceList[key].TEXT.replaceAll(tagName, replaceValue);
    }

    setBoilerplateRight(replaceList);
  }
  function createTextWildBattle() {
    let inputTargets = ["trainer", "poketmon", "attack", "tech", "etc"];
    let matcher = {trainer: "이름", poketmon: "포켓몬", attack: "공격방식", tech: "공격기술", etc: "기타"};

    // 첫번째 줄에 대한 값을 수집하고 갱신
    for (let tag of inputTargets) {
      let inputNode = document.querySelector(`#i-wildbattle-first-${tag}`);
      devLog("로드 재갱신 ", inputNode, `i-wildbattle-first-${tag}`, `$$로드${matcher[tag]}`);
      if (inputNode) {
        let value = inputNode.value;
        replaceBoilerplate(`$$로드${matcher[tag]}`, value);
      }
    }

    // 첫번째 줄에 대한 값을 수집하고 갱신
    for (let tag of inputTargets) {
      let inputNode = document.querySelector(`#i-wildbattle-second-${tag}`);
      if (inputNode) {
        let value = inputNode.value;
        replaceBoilerplate(`$$캠프${matcher[tag]}`, value);
      }
    }
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
      <div id="battlepage-wildbattle" className={isActive}>
        <div className="flex mt-4">
          <div className="flex flex-col w-5/6">
            <div className="bg-white">
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <div className="my-2">
                    <div className="shadow rounded-md">
                      <div className="bg-white px-4 py-3">
                        <div className="wildbattle-frame grid grid-cols-12 gap-2">
                          <GridInputText id={"i-wildbattle-first-trainer"} dataName={"trainer"} colSpan={3} label={"로드 트레이너 이름"}></GridInputText>
                          <GridInputText id={"i-wildbattle-first-poketmon"} dataName={"poketmon"} colSpan={3} label={"로드 트레이너 포켓몬"} options={attackOption}></GridInputText>
                          <div className="col-span-2">
                            <label htmlFor="i-wildbattle-first-attack" className="block text-sm font-medium text-gray-700">
                              공격
                            </label>
                            <div className="flex flex-row" style={{height: "39px"}}>
                              <input
                                id="i-wildbattle-first-attack"
                                name="i-wildbattle-first-attack"
                                className="mt-1 block w-3/4 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              />

                              <div className="text-right mt-1 ml-2">
                                <button
                                  type="button"
                                  className={[
                                    "py-2 px-1 text-sm font-medium text-white",
                                    "inline-flex justify-center rounded-md border border-transparent  shadow-sm  ",
                                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                    "bg-indigo-600 hover:bg-indigo-700",
                                  ].join(" ")}
                                  onClick={() => {
                                    let randomAttack = Math.floor(Math.random() * attackOption.length);
                                    document.querySelector("#i-wildbattle-first-attack").value = attackOption[randomAttack];
                                  }}
                                  style={{height: "39px", width: "50px"}}
                                >
                                  랜덤
                                </button>
                              </div>
                            </div>
                          </div>

                          <GridInputText id={"i-wildbattle-first-tech"} dataName={"tech"} colSpan={2} label={"공격기술"}></GridInputText>
                          <GridInputText id={"i-wildbattle-first-etc"} dataName={"etc"} colSpan={2} label={"기타변수1"}></GridInputText>
                          <GridInputText id={"i-wildbattle-second-trainer"} dataName={"trainer"} colSpan={3} label={"캠프 트레이너 이름"}></GridInputText>
                          <GridInputText id={"i-wildbattle-second-poketmon"} dataName={"poketmon"} colSpan={3} label={"캠프 트레이너 포켓몬"} options={attackOption}></GridInputText>
                          <GridInputText id={"i-wildbattle-second-attack"} dataName={"attack"} colSpan={2} label={"공격방식"}></GridInputText>
                          <GridInputText id={"i-wildbattle-second-tech"} dataName={"tech"} colSpan={2} label={"공격기술"}></GridInputText>
                          <GridInputText id={"i-wildbattle-second-etc"} dataName={"etc"} colSpan={2} label={"기타변수2"}></GridInputText>
                          <div className="research-frame grid grid-cols-6 col-span-12">
                            <GridInputButton label={"생성"} type="button" onclick={createTextWildBattle} colSpan={6}></GridInputButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex mt-1">
              <div className="flex w-1/2">
                <div className="w-full m-1 mr-1 bg-white">
                  <div className="shadow rounded-md">
                    <div className="bg-white px-4 py-1">
                      <div className="grid grid-cols-6 gap-6 my-1">
                        <GridInputButton label={"드롭다운"} buttonColor={"zinc"} onclick={() => setBoilerplateViewTypeLeft("dropdown")} colSpan={3} type="button"></GridInputButton>
                        <GridInputButton label={"리스트"} type="button" onclick={() => setBoilerplateViewTypeLeft("list")} colSpan={3}></GridInputButton>
                      </div>
                      {boilerplateLeft && makeBoilerplate(boilerplateLeft, boilerplateViewTypeLeft)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-1/2">
                <div className="w-full m-1 ml-0 bg-white">
                  <div className="shadow rounded-md">
                    <div className="bg-white px-4 py-1">
                      <div className="grid grid-cols-6 gap-6 my-1">
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
          <div className="flex flex-col w-1/6">
            <div className="bg-white">
              <div className="mx-auto py-2 px-2">
                <div className="flex flex-col w-full">
                  <NewBattleWildbattleSide />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
