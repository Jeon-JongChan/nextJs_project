/* next Module */
import { copyToClipBoard, findLocalDataByName } from "/scripts/client/client";
import { getRandomInt, asyncInterval, devLog } from "/scripts/common";
import { initAutoComplete } from "/scripts/client/autoComplete";
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { LocalDataContext } from "/page_components/MyContext";

/**
 *
 * @param {*} isActive 해당 컴포넌트의 활성화 여부
 * @returns
 */
export default function Layout(props) {
    let isActive = props?.isActive || "activate-tab"; //"hidden";
    const localData = useContext(LocalDataContext);
    let initState = true;

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
        }
    }

    function createTextWildBattle() {
        let targetList = ["poketmon", "health", "spec", "level", "personality", "music"];
        let inputs = document.querySelectorAll(".research-frame input");
        let inputValues = {};
        inputs.forEach((input) => {
            inputValues[input.dataset.name] = input.value || "";
        });
        let detailData = findLocalDataByName(inputValues.poketmon, localData.poketmon?.data);
        let randomSpecIdx = getRandomInt(1, 4);
        inputValues["spec"] = detailData?.["SPEC" + randomSpecIdx];
        inputValues["level"] = detailData ? getRandomInt(detailData.LEVEL_MIN, detailData.LEVEL_MAX + 1) : "oo";
        inputValues["personality"] = detailData?.["personality"] || "";
        devLog(inputs, inputValues, detailData, localData);
        targetList.forEach((element) => {
            let targetNodes = document.querySelectorAll(".pre-research spen[data-name='" + element + "']");
            targetNodes.forEach((node) => {
                // devLog("createTextResearch targetNodes " + element, " inputValues ", inputValues, inputValues[element]);
                node.innerText = inputValues[element];
            });
        });

        setResearchImage(detailData?.PATH || "");
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
                                                    <GridInputSelectBox
                                                        id={"i-wildbattle-first-attack"}
                                                        dataName={"attack"}
                                                        colSpan={2}
                                                        label={"공격"}
                                                        options={["재빠른 공격", "묵직한 공격", "유연한 공격", "포획한다"]}
                                                    ></GridInputSelectBox>
                                                    <GridInputText id={"i-wildbattle-first-health"} dataName={"health"} colSpan={1} label={"현재 체력"}></GridInputText>
                                                    <GridInputSelectBox
                                                        id={"i-wildbattle-first-compatibility"}
                                                        dataName={"compatibility"}
                                                        colSpan={1}
                                                        label={"상성 결과"}
                                                        options={["승", "패", "무"]}
                                                    ></GridInputSelectBox>

                                                    <GridInputText id={"i-wildbattle-second-poketmon"} dataName={"poketmon"} colSpan={2} label={"후공포켓몬"}></GridInputText>
                                                    <GridInputSelectBox
                                                        id={"i-wildbattle-second-attack"}
                                                        dataName={"attack"}
                                                        colSpan={2}
                                                        label={"공격"}
                                                        options={["재빠른 공격", "묵직한 공격", "유연한 공격", "포획한다"]}
                                                    ></GridInputSelectBox>
                                                    <GridInputText id={"i-wildbattle-second-health"} dataName={"health"} colSpan={1} label={"현재 체력"}></GridInputText>
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
                                <div className="m-1 mr-1 bg-white overflow-x-auto scrollbar-remove">
                                    <div className="shadow rounded-md">
                                        <div className="bg-white px-4 py-3">
                                            <div className="grid grid-cols-6">
                                                <GridInputButton label={"Copy"} buttonColor={"zinc"} onclick={() => copyToClipBoard(".pre-research")} colSpan={3} type="button"></GridInputButton>
                                                <GridInputButton label={"생성"} type="button" onclick={null} colSpan={3}></GridInputButton>
                                            </div>
                                        </div>
                                        {/* prettier-ignore */}
                                        <pre className="pre-wildbattle px-4 py-3">
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen>의 <spen className={'wb-first'} data-name={"attack"}>(선공 포켓몬의 선택 공격)!</spen> <br />
                                            <br />
                                            야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen>의 <spen className={'wb-second'} data-name={"attack"}>(후공 포켓몬의 선택 랜덤 공격)!</spen><br />
                                            <br />
                                            💥야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen>은(는) -<spen className={'wb-first'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            💥<spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen>은(는) -<spen className={'wb-second'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            <br />
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen> : <spen className={'wb-first'} data-name={"health"}>(선공 포켓몬의 체력 - 데미지)</spen><br />
                                            <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen> : <spen className={'wb-first'} data-name={"health"}>(후공 포켓몬의 체력 - 데미지)</spen><br />
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
                                <div className="m-1 ml-0 bg-white overflow-x-auto scrollbar-remove">
                                    <div className="shadow rounded-md">
                                        <div className="bg-white px-4 py-3">
                                            <div className="grid grid-cols-6">
                                                <GridInputButton label={"Copy"} buttonColor={"zinc"} onclick={() => copyToClipBoard(".pre-research")} colSpan={3} type="button"></GridInputButton>
                                                <GridInputButton label={"생성"} type="button" onclick={null} colSpan={3}></GridInputButton>
                                            </div>
                                        </div>
                                        {/* prettier-ignore */}
                                        <pre className="pre-research px-4 py-3">
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen>의 <spen className={'wb-first'} data-name={"attack"}>(선공 포켓몬의 선택 공격)!</spen> <br />
                                            <br />
                                            야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen>의 <spen className={'wb-second'} data-name={"attack"}>(후공 포켓몬의 선택 랜덤 공격)!</spen><br />
                                            <br />
                                            💥야생의 <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen>은(는) -<spen className={'wb-first'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            💥<spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen>은(는) -<spen className={'wb-second'} data-name={"damage"}>0</spen>의 데미지를 입었다!<br />
                                            <br />
                                            <spen className={'wb-first'} data-name={"poketmon"}>(선공 포켓몬)</spen> : <spen className={'wb-first'} data-name={"health"}>(선공 포켓몬의 체력 - 데미지)</spen><br />
                                            <spen className={'wb-second'} data-name={"poketmon"}>(후공 포켓몬)</spen> : <spen className={'wb-first'} data-name={"health"}>(후공 포켓몬의 체력 - 데미지)</spen><br />
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
                                    {bolierPlate
                                        ? bolierPlate["wildbattle"].map((text, index) => {
                                              return (
                                                  <div className="shadow rounded-md p-1 mb-1 bg-slate-300">
                                                      <pre className="bg-white p-2 text-sm font-medium text-gray-700 overflow-x-auto scrollbar-remove">{text}</pre>
                                                  </div>
                                              );
                                          })
                                        : null}
                                </div>
                            </div>
                            <div className="mx-auto py-2 px-2">
                                <div className="flex flex-col w-full">
                                    <div className="shadow rounded-md"></div>
                                    <div className="shadow rounded-md"></div>
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
