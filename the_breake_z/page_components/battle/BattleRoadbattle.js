/* next Module */
import { initAutoComplete } from "/scripts/client/autoComplete";
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import SelectDropdownText from "/page_components/public/SelectDropdownText";
import { LocalDataContext } from "/page_components/MyContext";
import { useEffect, useState, useRef, useContext } from "react";
import { getRandomInt, asyncInterval, devLog } from "/scripts/common";
import { copyToClipBoard, findLocalDataByName, clickCopyToClipBoard } from "/scripts/client/client";

/**
 *
 * @param {*} isActive 해당 컴포넌트의 활성화 여부
 * @returns
 */
export default function Layout(props) {
    const localData = useContext(LocalDataContext);
    let isActive = props?.isActive || "activate-tab"; //"hidden";

    let pageName = "roadbattle";
    const boilerplateSync = useRef();
    const [boilerplate, setBoilerplate] = useState({});
    const [boilerplateViewType, setBoilerplateViewType] = useState("dropdown");

    let initState = true;

    let compatibilityOption = ["-", "효과 좋음(- 1d10)", "효과 부족(- 1d5)", "효과 없음(- 1d0)"];

    useEffect(() => {
        init();
    }, []);

    function init() {
        if (initState) {
            try {
                initAutoComplete("i-roadbattle-first-poketmon", "poketmon", localData);
                initAutoComplete("i-roadbattle-second-poketmon", "poketmon", localData);

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
                devLog("BattleRoadbattle init error. localData :", localData, e.message);
            }
            initState = false;
        }
    }
    function clickRandomAttack(e) {
        let attackList = ["선공", "후공"];
        let attack = attackList[getRandomInt(0, attackList.length)];
        let target = document.querySelector("#rand-attack");
        target.innerText = attack;
    }

    function changeAttack(e) {
        let matchTag = {
            "i-roadbattle-first-attack": "#i-roadbattle-first-compatibility",
            "i-roadbattle-second-attack": "#i-roadbattle-second-compatibility",
        };
        let targetId = e.target.id;
        let targetValue = e.target.value;

        let targetNode = document.querySelector(matchTag[targetId]);
        devLog("changeAttack", targetId, targetValue, targetNode);
        if (targetValue === "💥일반 공격 (PP -1)" || targetValue === "💢맡긴다 (PP가 0일 때)" || targetValue === "🛡️방어 (PP -2)") if (targetNode) targetNode.value = "-";
    }

    function changeBehavior(e) {
        let matchTag = {
            "i-roadbattle-first-behavior": "#i-roadbattle-first-attack",
            "i-roadbattle-second-behavior": "#i-roadbattle-second-attack",
        };
        let targetId = e.target.id;
        let targetValue = e.target.value;

        let targetNode = document.querySelector(matchTag[targetId]);
        if (targetValue === "방어") if (targetNode) targetNode.value = "🛡️방어 (PP -2)";
    }

    function createTextRoadBattle(preClassName) {
        let inputOrder = ["first", "second"];
        let inputList = ["poketmon", "health", "behavior", "attack", "type", "sp", "compatibility"];
        let spanList = ["poketmon", "behaviorText", "attackText", "health", "sp"];
        let compatibilityDamageList = {
            "효과 좋음(- 1d10)": 10,
            "효과 부족(- 1d5)": -5,
            "효과 없음(- 1d0)": 0,
            "-": 0,
        };
        // wildbattle-frame i-wildbattle-first
        let inputValues = {};
        inputOrder.forEach((order) => {
            inputValues[order] = {};
            inputList.forEach((input) => {
                inputValues[order][input] = document.querySelector(".roadbattle-frame #i-roadbattle-" + order + "-" + input).value;
            });
        });
        inputOrder.forEach((order) => {
            let inputValue = inputValues[order];
            if (inputValue["behavior"] === "공격") {
                let attack = inputValue["attack"];
                let compatibility = inputValue["compatibility"];
                let compatibilityDamage = compatibilityDamageList?.[compatibility] || 0;
                let attackDamage = 0;
                let usingSp = 0;
                inputValue["defense"] = 0; // 방어 0으로 초기화 ( 방어일 경우만 값을 변경 )

                if (attack === "💥일반 공격 (PP -1)") {
                    attackDamage = getRandomInt(2, 5 + 1);
                    inputValue["behaviorText"] = "💥" + inputValue["poketmon"] + "의 일반 공격!";
                    compatibilityDamage = 0;
                    usingSp = 1;
                } else if (attack === "⭐️타입 공격 (PP -3)") {
                    inputValue["behaviorText"] = "⭐️" + inputValue["poketmon"] + "의 " + inputValue["type"] + " 타입 공격!";
                    attackDamage = getRandomInt(4, 10 + 1) + getRandomInt(4, 10 + 1);
                    usingSp = 3;
                } else if (attack === "💢맡긴다 (PP가 0일 때)") {
                    inputValue["behaviorText"] = "💢" + inputValue["poketmon"] + " 는 자신의 판단하에 상대를 공격했다!";
                    attackDamage = getRandomInt(1, 3 + 1);
                    compatibilityDamage = 0;
                    usingSp = 0;
                    inputValue["attackText"] = "💢" + inputValue["poketmon"] + "의 공격! -";
                } else if (attack === "🛡️방어 (PP -2)") {
                    attackDamage = 0;
                    compatibilityDamage = 0;
                    inputValue["defense"] = getRandomInt(1, 15 + 1);
                    usingSp = 2;
                    inputValue["behaviorText"] = "🛡️" + inputValue["poketmon"] + "의 방어!";
                    inputValue["attackText"] = "🛡️" + inputValue["poketmon"] + " 은(는) 방어 태세를 갖추고 다음 공격에 대비하고 있다! +" + inputValue["defense"].toString();
                }

                if (attack !== "💥일반 공격 (PP -1)" && attack !== "💢맡긴다 (PP가 0일 때)" && attack !== "🛡️방어 (PP -2)") {
                    if (compatibility === "효과 좋음(- 1d10)") {
                        inputValue["attackText"] = "효과가 굉장했다! -";
                    } else if (compatibility === "효과 부족(- 1d5)") {
                        inputValue["attackText"] = "효과가 부족한 것 같았다… -";
                    } else if (compatibility === "효과 없음(- 1d0)") {
                        inputValue["attackText"] = "효과가 없는 것 같았다… -";
                        attackDamage = 0;
                    }
                }
                inputValue["damage"] = attackDamage + compatibilityDamage;
                inputValue["damage"] = inputValue["damage"] <= 0 ? 0 : inputValue["damage"];

                if (compatibility === "-" || attack === "💥일반 공격 (PP -1)" || attack === "💢맡긴다 (PP가 0일 때)") {
                    inputValue["attackText"] = "";
                    inputValue["behaviorText"] += " -" + inputValue["damage"].toString();
                } else {
                    inputValue["attackText"] += inputValue["damage"].toString();
                }

                inputValue["sp"] -= usingSp;
            } else if (inputValue["behavior"] === "방어") {
                inputValue["damage"] = 0;
                inputValue["defense"] = getRandomInt(1, 15 + 1);
                inputValue["sp"] -= 2;
                inputValue["behaviorText"] = "🛡️" + inputValue["poketmon"] + "의 방어!";
                inputValue["attackText"] = "🛡️" + inputValue["poketmon"] + " 은(는) 방어 태세를 갖추고 다음 공격에 대비하고 있다! +" + inputValue["defense"].toString();
            }
        });

        inputValues["first"]["health"] = parseInt(inputValues["first"]["health"]) + (inputValues["first"]["defense"] - inputValues["second"]["damage"]);
        inputValues["second"]["health"] = parseInt(inputValues["second"]["health"]) + inputValues["second"]["defense"] - inputValues["first"]["damage"];
        inputOrder.forEach((order) => {
            spanList.forEach((span) => {
                let targetNode = document.querySelectorAll(preClassName + " .rb-" + order + "[data-name='" + span + "']");
                targetNode.forEach((node) => {
                    node.innerText = inputValues[order][span];
                });
            });
        });
    }

    return (
        <>
            <div id="battlepage-roadbattle" className={isActive}>
                <div className="flex flex-col mt-4">
                    <div className="block bg-white">
                        <div className="mx-auto py-2 px-2">
                            <div className="flex flex-col w-full">
                                <div className="my-2">
                                    <div className="shadow rounded-md">
                                        <div className="bg-white px-4 py-3">
                                            <div className="roadbattle-frame grid grid-cols-10 gap-2">
                                                <GridInputText id={"i-roadbattle-first-poketmon"} dataName={"poketmon"} colSpan={2} label={"선공포켓몬"}></GridInputText>
                                                <GridInputSelectBox
                                                    id={"i-roadbattle-first-behavior"}
                                                    dataName={"behavior"}
                                                    onchange={changeBehavior}
                                                    colSpan={1}
                                                    label={"행동 분류"}
                                                    options={["공격", "방어"]}
                                                ></GridInputSelectBox>
                                                <GridInputSelectBox
                                                    id={"i-roadbattle-first-attack"}
                                                    dataName={"attack"}
                                                    onchange={changeAttack}
                                                    colSpan={2}
                                                    label={"행동 선택"}
                                                    options={["💥일반 공격 (PP -1)", "⭐️타입 공격 (PP -3)", "🛡️방어 (PP -2)", "💢맡긴다 (PP가 0일 때)"]}
                                                ></GridInputSelectBox>
                                                <GridInputText id={"i-roadbattle-first-type"} dataName={"type"} colSpan={1} label={"공격타입"} default={"물"}></GridInputText>
                                                <GridInputText id={"i-roadbattle-first-sp"} dataName={"sp"} colSpan={1} label={"현재 PP"} default={10} type={"number"}></GridInputText>
                                                <GridInputText id={"i-roadbattle-first-health"} dataName={"health"} colSpan={1} label={"현재 체력"} default={50} type={"number"}></GridInputText>
                                                <GridInputSelectBox
                                                    id={"i-roadbattle-first-compatibility"}
                                                    dataName={"compatibility"}
                                                    colSpan={2}
                                                    label={"데미지상성"}
                                                    options={compatibilityOption}
                                                ></GridInputSelectBox>

                                                <GridInputText id={"i-roadbattle-second-poketmon"} dataName={"poketmon"} colSpan={2} label={"후공포켓몬"}></GridInputText>
                                                <GridInputSelectBox
                                                    id={"i-roadbattle-second-behavior"}
                                                    dataName={"behavior"}
                                                    onchange={changeBehavior}
                                                    colSpan={1}
                                                    label={"행동 분류"}
                                                    options={["공격", "방어"]}
                                                ></GridInputSelectBox>
                                                <GridInputSelectBox
                                                    id={"i-roadbattle-second-attack"}
                                                    dataName={"attack"}
                                                    onchange={changeAttack}
                                                    colSpan={2}
                                                    label={"행동 선택"}
                                                    options={["💥일반 공격 (PP -1)", "⭐️타입 공격 (PP -3)", "🛡️방어 (PP -2)", "💢맡긴다 (PP가 0일 때)"]}
                                                ></GridInputSelectBox>
                                                <GridInputText id={"i-roadbattle-second-type"} dataName={"type"} colSpan={1} label={"공격타입"} default={"물"}></GridInputText>
                                                <GridInputText id={"i-roadbattle-second-sp"} dataName={"sp"} colSpan={1} label={"현재 PP"} default={10} type={"number"}></GridInputText>
                                                <GridInputText id={"i-roadbattle-second-health"} dataName={"health"} colSpan={1} label={"현재 체력"} default={50} type={"number"}></GridInputText>
                                                <GridInputSelectBox
                                                    id={"i-roadbattle-second-compatibility"}
                                                    dataName={"compatibility"}
                                                    colSpan={2}
                                                    label={"데미지상성"}
                                                    options={compatibilityOption}
                                                ></GridInputSelectBox>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full">
                        <div className="flex flex-col w-1/3">
                            <div className="m-1 mr-1 bg-white">
                                <div className="shadow rounded-md">
                                    <div className="bg-white px-4 py-3">
                                        <div className="grid grid-cols-6">
                                            <GridInputButton label={"Copy"} buttonColor={"zinc"} onclick={() => copyToClipBoard(".pre-roadbattle")} colSpan={3} type="button"></GridInputButton>
                                            <GridInputButton label={"생성"} type="button" onclick={() => createTextRoadBattle(".pre-roadbattle")} colSpan={3}></GridInputButton>
                                        </div>
                                    </div>
                                    {/* prettier-ignore */}
                                    <pre className="pre-roadbattle mx-4 py-3 overflow-x-auto scrollbar-remove">
                                        <spen className={'rb-first'} data-name={"behaviorText"}>(행동 분류 관련 텍스트)</spen><br/>
                                        <spen className={'rb-first'} data-name={"attackText"}>(행동 선택에 따른 관련 텍스트)</spen><br/>
                                        <br/>
                                        <spen className={'rb-second'} data-name={"behaviorText"}>(행동 분류 관련 텍스트)</spen><br/>
                                        <spen className={'rb-second'} data-name={"attackText"}>(행동 선택에 따른 관련 텍스트)</spen><br/>
                                        <br/>
                                        <spen className={'rb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen> : <span className={'rb-first'} data-name={"health"}> 0 </span><br/>
                                        <spen className={'rb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen> : <span className={'rb-second'} data-name={"health"}> 0 </span><br/>
                                        <br/>
                                        <br/>
                                        어떤 행동을 지시할까? (PP : <span className={'rb-first'} data-name={"sp"}> 10 </span>/10)<br/>
                                        <br/>
                                        ▷ 💥일반 공격 (PP -1)<br/>
                                        ▷ ⭐️타입 공격 (PP -3)<br/>
                                        ▷ 🛡️방어 (PP -2)<br/>
                                        ▷💢맡긴다 (PP가 0일 때)<br/>
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-1/3">
                            <div className="flex flex-col w-full">
                                <pre className="shadow rounded-md p-2 text-sm font-medium text-gray-700">
                                    선공/후공 랜덤 산출 <br />
                                    <span id="rand-attack" className="text-5xl text-center block">
                                        선공
                                    </span>
                                </pre>
                                <div className="shadow rounded-md">
                                    <div className="bg-white p-1">
                                        <div className="grid grid-cols-5 gap-6">
                                            <div className="col-span-1"></div>
                                            <GridInputButton label={"랜덤생성"} type="button" onclick={clickRandomAttack} colSpan={3}></GridInputButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-1/3">
                            <div className="bg-white">
                                <div className="mx-auto py-2 px-2">
                                    <div className="flex flex-col w-full">
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
                </div>
            </div>
        </>
    );
}

let bolierPlate = {
    roadbattle: [
        `
❗️ 눈이 마주치면 포켓몬 승부!
…-의 선공!

도전할 로드 트레이너의 정보와
내보낼 포켓몬의 정보(이름, 레벨)를 기입해주시기 바랍니다.
`,
        `
🎵https://youtu.be/o0LZKtKV3lI
-이(가) 승부를 걸어왔다!
상대 -은(는) -을(를) 내보냈다!

-은(는) -을(를) 내보냈다!

- : 50
- : 50

어떤 행동을 지시할까? (PP : -/10)

▷ 💥일반 공격 (PP -1)
▷ ⭐️타입 공격 (PP -3)
▷ 🛡️방어 (PP -2)
▷ 💢맡긴다 (PP가 0일 때)
`,
        `
은(는) 쓰러졌다!
-와의 승부에서 이기지 못했다!

-의 눈 앞이 캄캄해졌다…
`,
        `
상대 은(는) 쓰러졌다!

-와의 승부에서 승리했다!
은(는) 1,500원과 트레이닝 레코드 3개를 획득했다!
`,
        `
✔️배틀 종료! 수고했어 로토~!
       `,
    ],
};
