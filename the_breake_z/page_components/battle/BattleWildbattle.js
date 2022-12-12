/* next Module */
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import SelectDropdownText from "/page_components/public/SelectDropdownText";
import { LocalDataContext } from "/page_components/MyContext";
import { useEffect, useState, useRef, useContext } from "react";
import { initAutoComplete } from "/scripts/client/autoComplete";
import { getRandomInt, asyncInterval, devLog } from "/scripts/common";
import { copyToClipBoard, clickCopyToClipBoard, findLocalDataByName } from "/scripts/client/client";

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
    const [boilerplate, setBoilerplate] = useState({});
    const [boilerplateViewType, setBoilerplateViewType] = useState("dropdown");

    let initState = true;
    const attackOption = ["✌️재빠른 공격", "✊묵직한 공격", "🖐️유연한 공격"];

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
                    if (localData?.boilerplate?.[pageName]) {
                        devLog(pageName + " 페이지에서 전역변수로 인한 늦은 상용문구 출력을 완료했습니다");
                        boilerplateSync.current.stop();
                        setBoilerplate(localData?.boilerplate?.[pageName]);
                        return null;
                    }
                }, 3);
                boilerplateSync.current.start();
            }
        }
    }

    function createTextWildBattle(preClassName, isStrange = false) {
        devLog("createTextWildBattle : ", localData);
        let inputOrder = ["first", "second"];
        let inputList = ["poketmon", "health", "attack", "compatibility"];
        let spanList = ["poketmon", "health", "attack", "damage"];
        let compatibilityDamage = {
            승: 5,
            패: 2,
            무: 3,
        };
        let strangeFirstDamage = {
            승: 5,
            패: 2,
            무: 0,
        };
        let strangeSecondDamage = {
            승: 6,
            패: 3,
            무: 2,
        };
        // wildbattle-frame i-wildbattle-first
        let inputValues = {};
        inputOrder.forEach((order) => {
            inputValues[order] = {};
            inputList.forEach((input) => {
                inputValues[order][input] = document.querySelector(".wildbattle-frame #i-wildbattle-" + order + "-" + input).value || undefined;
            });
        });
        if (isStrange) {
            inputValues["first"]["damage"] = strangeFirstDamage[inputValues["first"]["compatibility"]];
            inputValues["second"]["damage"] = strangeSecondDamage[inputValues["second"]["compatibility"]];
        } else {
            inputValues["first"]["damage"] = compatibilityDamage[inputValues["first"]["compatibility"]];
            inputValues["second"]["damage"] = compatibilityDamage[inputValues["second"]["compatibility"]];
        }
        inputValues["first"]["health"] = inputValues["first"]["health"] - inputValues["second"]["damage"];
        inputValues["second"]["health"] = inputValues["second"]["health"] - inputValues["first"]["damage"];

        inputOrder.forEach((order) => {
            spanList.forEach((span) => {
                let targetNode = document.querySelectorAll(preClassName + " .wb-" + order + "[data-name='" + span + "']");
                targetNode.forEach((node) => {
                    node.innerText = inputValues[order][span];
                });
            });
        });
    }

    return (
        <>
            <div id="battlepage-wildbattle" className={isActive}>
                <div className="flex mt-4">
                    <div className="flex flex-col w-2/3">
                        <div className="bg-white">
                            <div className="mx-auto py-2 px-2">
                                <div className="flex flex-col w-full">
                                    <div className="my-2">
                                        <div className="shadow rounded-md">
                                            <div className="bg-white px-4 py-3">
                                                <div className="wildbattle-frame grid grid-cols-6 gap-6">
                                                    <GridInputText id={"i-wildbattle-first-poketmon"} dataName={"poketmon"} colSpan={2} label={"선공포켓몬"}></GridInputText>
                                                    <GridInputSelectBox id={"i-wildbattle-first-attack"} dataName={"attack"} colSpan={2} label={"공격"} options={attackOption}></GridInputSelectBox>
                                                    <GridInputText id={"i-wildbattle-first-health"} dataName={"health"} colSpan={1} label={"현재 체력"} default={10}></GridInputText>
                                                    <GridInputSelectBox
                                                        id={"i-wildbattle-first-compatibility"}
                                                        dataName={"compatibility"}
                                                        colSpan={1}
                                                        label={"상성 결과"}
                                                        options={["승", "패", "무"]}
                                                    ></GridInputSelectBox>

                                                    <GridInputText id={"i-wildbattle-second-poketmon"} dataName={"poketmon"} colSpan={2} label={"후공포켓몬"}></GridInputText>
                                                    <div className="col-span-2">
                                                        <label htmlFor="i-wildbattle-second-attack" className="block text-sm font-medium text-gray-700">
                                                            공격
                                                        </label>
                                                        <div className="flex flex-row">
                                                            <select
                                                                id="i-wildbattle-second-attack"
                                                                name="i-wildbattle-second-attack"
                                                                className="mt-1 block w-3/4 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                            >
                                                                {attackOption.map((option, idx) => {
                                                                    return (
                                                                        <option key={idx} value={option}>
                                                                            {option}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                            <div className="text-right mt-1 ml-2">
                                                                <button
                                                                    type="button"
                                                                    className={[
                                                                        "w-full py-2 px-4 text-sm font-medium text-white",
                                                                        "inline-flex justify-center rounded-md border border-transparent  shadow-sm  ",
                                                                        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                                                        "bg-indigo-600 hover:bg-indigo-700",
                                                                    ].join(" ")}
                                                                    onClick={() => {
                                                                        let randomAttack = Math.floor(Math.random() * attackOption.length);
                                                                        document.querySelector("#i-wildbattle-second-attack").value = attackOption[randomAttack];
                                                                    }}
                                                                >
                                                                    랜덤
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <GridInputText id={"i-wildbattle-second-health"} dataName={"health"} colSpan={1} label={"현재 체력"} default={10}></GridInputText>
                                                    <GridInputSelectBox
                                                        id={"i-wildbattle-second-compatibility"}
                                                        dataName={"compatibility"}
                                                        colSpan={1}
                                                        label={"상성 결과"}
                                                        options={["승", "패", "무"]}
                                                    ></GridInputSelectBox>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="flex w-1/2">
                                <div className="w-full m-1 mr-1 bg-white">
                                    <div className="shadow rounded-md">
                                        <div className="bg-white px-4 py-3">
                                            <div className="grid grid-cols-6">
                                                <GridInputButton label={"Copy"} buttonColor={"zinc"} onclick={() => copyToClipBoard(".pre-wildbattle")} colSpan={3} type="button"></GridInputButton>
                                                <GridInputButton label={"생성"} type="button" onclick={() => createTextWildBattle(".pre-wildbattle")} colSpan={3}></GridInputButton>
                                            </div>
                                        </div>
                                        {/* prettier-ignore */}
                                        <pre className="pre-wildbattle mx-4 py-3 overflow-x-auto scrollbar-remove">
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen>의 <spen className={'wb-first'} data-name={"attack"}>(선공 포켓몬의 선택 공격)!</spen> <br />
                                            <br />
                                            야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen>의 <spen className={'wb-second'} data-name={"attack"}>(후공 포켓몬의 선택 랜덤 공격)!</spen><br />
                                            <br />
                                            💥야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen> 은(는) -<spen className={'wb-first'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            💥<spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen> 은(는) -<spen className={'wb-second'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            <br />
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen> : <spen className={'wb-first'} data-name={"health"}>(선공 포켓몬의 체력 - 데미지)</spen><br />
                                            <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen> : <spen className={'wb-second'} data-name={"health"}>(후공 포켓몬의 체력 - 데미지)</spen><br />
                                            <br />
                                            ..무엇을 할까 로토?<br />
                                            <br />
                                            ▷✌️재빠른 공격<br />
                                            ▷✊묵직한 공격<br />
                                            ▷🖐️유연한 공격<br />
                                            ▷ 포획한다.<br />
                                        </pre>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-1/2">
                                <div className="w-full m-1 ml-0 bg-white">
                                    <div className="shadow rounded-md">
                                        <div className="bg-white px-4 py-3">
                                            <div className="grid grid-cols-6">
                                                <GridInputButton label={"Copy"} buttonColor={"zinc"} onclick={() => copyToClipBoard(".pre-strangebattle")} colSpan={3} type="button"></GridInputButton>
                                                <GridInputButton label={"생성"} type="button" onclick={() => createTextWildBattle(".pre-strangebattle", true)} colSpan={3}></GridInputButton>
                                            </div>
                                        </div>
                                        {/* prettier-ignore */}
                                        <pre className="pre-strangebattle mx-4 py-3 overflow-x-auto scrollbar-remove">
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen>의 <spen className={'wb-first'} data-name={"attack"}>(선공 포켓몬의 선택 공격)!</spen> <br />
                                            <br />
                                            야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen>의 <spen className={'wb-second'} data-name={"attack"}>(후공 포켓몬의 선택 랜덤 공격)!</spen><br />
                                            <br />
                                            💥야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen>은(는) -<spen className={'wb-first'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            💥<spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen>은(는) -<spen className={'wb-second'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            <br />
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen> : <spen className={'wb-first'} data-name={"health"}>(선공 포켓몬의 체력 - 데미지)</spen><br />
                                            <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen> : <spen className={'wb-second'} data-name={"health"}>(후공 포켓몬의 체력 - 데미지)</spen><br />
                                            <br />
                                            ..무엇을 할까 로토?<br />
                                            <br />
                                            ▷✌️재빠른 공격(이상 개체)<br />
                                            ▷✊묵직한 공격(이상 개체)<br />
                                            ▷🖐️유연한 공격(이상 개체)<br />
                                            ▷ 포획한다.<br />
                                        </pre>
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
        </>
    );
}

let bolierPlate = {
    wildbattle: [
        `
야생의 -은(는) 공격을 하기 위해 자세를 바로 잡고 있다..
내보낼 포켓몬의 정보(이름, 레벨)를 기입해주시기 바랍니다.
`,
        `
-은(는) -을(를) 내보냈다!

- : 10
- : 10, 15

..무엇을 할까 로토?

▷✌️재빠른 공격
▷✊묵직한 공격
▷🖐️유연한 공격
▷ 포획한다.
`,
        `

야생의 은(는) 쓰러졌다!
은(는) 0.5의 경험치를 획득했다!

은(는) 쓰러졌다!
…어떻게 할까 로토?

▷다음 포켓몬을 내보낸다.
▷도망간다.
`,
        `
✔️배틀 종료! 수고했어 로토~!
`,
    ],
};

const failText = [
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
여기는 아무것도 보이지 않는 것 같아 로토! 다른 곳에 가볼까?

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
조금 전 까지 여기 있었던 것 같은데 로토… 조금 더 찾아보자 로토!

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
이건 다른 포켓몬의 발자국이야 로토! 다른 곳에 가볼까 로토?

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
로토? …케테-! 무슨 소린가 했는데 내 꼬르륵 소리였어 로토!

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
흔적이 보이지 않아 로토! 저기 있는 포켓몬들한테 물어보면 알까 로토?

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
저 쪽에서 방금 무슨 소리 들리지 않았어 로토? 한 번 가보자 로토!

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
…썰렁할 정도로 조용해 로토-!!

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
앗! 이건! …. 대타출동 인형이야 로토! 누가 이런걸 두고 간 거지 로토?

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
(포켓몬의 울음소리가 들린다!)
로토? 아, 이건 내가 그 포켓몬 울음소리 샘플을 재생해본거야 로토!

▷수색을 이어간다.
`,
    `
- ⚡️야생 포켓몬 ~의 흔적 수색 중 로토…
어어?…찾았다! …..내 보조 배터리 말이야, 로토~

▷수색을 이어간다.
`,
];
