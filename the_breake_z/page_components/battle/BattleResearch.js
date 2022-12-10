/* next Module */
import { copyToClipBoard, clickCopyToClipBoard, findLocalDataByName, findLocalDataByLocal } from "/scripts/client/client";
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

    const [researchImage, setResearchImage] = useState("");
    const [wildCaptureFirst, setWildCaptureFirst] = useState(0);
    const [wildCaptureSecond, setWildCaptureSecond] = useState(0);
    const [wildCaptureBattle, setWildCaptureBattle] = useState(0);
    const [traceRate, setTraceRate] = useState(0);
    const [traceFailText, setTraceFailText] = useState(`
    
    
    
    
    `);

    let randFunc, randTenFunc;
    let initState = true;

    useEffect(() => {
        initResearch();
    }, []);

    function initResearch() {
        if (initState) {
            try {
                randFunc = new asyncInterval((node, query) => {
                    node = node || document.querySelector(query);
                    if (!node) return;
                    node.innerText = getRandomInt(1, 100 + 1);
                }, 3);
                randTenFunc = new asyncInterval((node, query) => {
                    node = node || document.querySelector(query);
                    if (!node) return;
                    node.innerText = getRandomInt(1, 20 + 1) * 10;
                }, 3);

                initAutoComplete("i-research-local", "local", localData);
                initAutoComplete("i-research-wildname", "poketmon", localData);
            } catch (e) {
                devLog("BattleResearch initResearch error. localData :", localData, e.message);
            }
            initState = false;
        }
    }

    function createTextResearch() {
        let targetList = ["trainer", "poketmon", "spec", "level", "personality", "music"];
        let inputs = document.querySelectorAll(".research-frame input");
        let inputValues = {};
        inputs.forEach((input) => {
            inputValues[input.dataset.name] = input.value || "";
        });

        let poketmonInLocal = findLocalDataByLocal(inputValues.local, localData.poketmon?.data);
        let detailData = poketmonInLocal[getRandomInt(0, poketmonInLocal.length)];
        let randomSpecIdx = getRandomInt(1, 4);
        inputValues["poketmon"] = detailData?.NAME;
        inputValues["spec"] = detailData?.["SPEC" + randomSpecIdx];
        inputValues["level"] = detailData ? getRandomInt(detailData.LEVEL_MIN, detailData.LEVEL_MAX + 1) : "oo";
        inputValues["personality"] = detailData?.["personality"] || "";
        targetList.forEach((element) => {
            let targetNodes = document.querySelectorAll(".pre-research spen[data-name='" + element + "']");
            targetNodes.forEach((node) => {
                // devLog("createTextResearch targetNodes " + element, " inputValues ", inputValues, inputValues[element]);
                node.innerText = inputValues[element];
            });
        });

        setResearchImage(detailData?.PATH || "");
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
        let target = document.querySelector("#i-research-tracecount");
        let targetValue = parseInt(target.value);
        setTraceRate(1 + (4 * targetValue - 4));
        devLog(" startTrace : ", traceFailText, getRandomInt(0, traceFailText.length), traceFailText[getRandomInt(0, traceFailText.length)]);
        setTraceFailText(failText[getRandomInt(0, failText.length)]);
    }

    return (
        <>
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
                                                    <GridInputText
                                                        id={"i-research-music"}
                                                        dataName={"music"}
                                                        colSpan={6}
                                                        label={"유투브 음악주소"}
                                                        default={"https://youtu.be/D7bYpd7Wiis"}
                                                    ></GridInputText>
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
                                                🎵<spen data-name={"music"}>(https://youtu.be/D7bYpd7Wiis)</spen> <br />
                                                앗, 야생의<spen data-name={"personality"}>(성격)</spen> <spen data-name={"poketmon"}>(포켓몬)</spen> 이(가) 나타났다!
                                                <br />
                                                <spen data-name={"poketmon"}>(포켓몬)</spen> Lv.<spen data-name={"level"}>(00)</spen> <spen data-name={"spec"}>(특성)</spen> <br />
                                                <br />
                                                ..무엇을 할까 <spen data-name={"trainer"}>(트레이너)</spen>? <br />
                                                ▷ 배틀한다 <br />
                                                ▷ 포획한다 <br />
                                                ▷ 도망간다 <br />
                                            </pre>
                                            <img id="research-img" src={researchImage}></img>
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
                                            <span id="rand" className="text-5xl text-center block">
                                                0
                                            </span>
                                        </pre>
                                        <div className="shadow rounded-md">
                                            <div className="bg-white p-1">
                                                <div className="grid grid-cols-6 gap-6">
                                                    <GridInputButton
                                                        label={"START"}
                                                        buttonColor={"zinc"}
                                                        onclick={() => randFunc.start(document.querySelector("#rand"))}
                                                        colSpan={3}
                                                        type="button"
                                                    ></GridInputButton>
                                                    <GridInputButton label={"STOP"} type="button" onclick={() => randFunc.stop()} colSpan={3}></GridInputButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <pre className="shadow rounded-md p-2 text-sm font-medium text-gray-700">
                                            난수 생성 x10 ( 10 ~ 200 ) <br />
                                            <span id="randTen" className="text-5xl text-center block">
                                                0
                                            </span>
                                        </pre>
                                        <div className="shadow rounded-md">
                                            <div className="bg-white p-1">
                                                <div className="grid grid-cols-6 gap-6">
                                                    <GridInputButton
                                                        label={"START"}
                                                        buttonColor={"zinc"}
                                                        onclick={() => randTenFunc.start(document.querySelector("#randTen"))}
                                                        colSpan={3}
                                                        type="button"
                                                    ></GridInputButton>
                                                    <GridInputButton label={"STOP"} type="button" onclick={() => randTenFunc.stop()} colSpan={3}></GridInputButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        {bolierPlate
                                            ? bolierPlate["research"].map((text, index) => {
                                                  return (
                                                      <div key={index} className="shadow rounded-md p-1 mb-1 bg-slate-300">
                                                          <pre onClick={clickCopyToClipBoard} className="bg-white p-2 text-sm font-medium text-gray-700 overflow-x-auto scrollbar-remove">
                                                              {text}
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
                                        <span id="randTen" className="text-5xl text-center block">
                                            {wildCaptureFirst}
                                        </span>
                                    </pre>
                                    <pre id="research-wild-capture-second" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center">
                                        두번째 시도 포획 확률 <br />
                                        <span id="randTen" className="text-5xl text-center block">
                                            {wildCaptureSecond}
                                        </span>
                                    </pre>
                                    <pre id="research-wild-capture-battle" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center">
                                        배틀 도중 포획 확률 <br />
                                        <span id="randTen" className="text-5xl text-center block">
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
                                        <span id="randTen" className="text-5xl text-center block">
                                            {traceRate}
                                        </span>
                                    </pre>
                                    <pre id="research-trace-failtext" className="shadow rounded-md p-2 text-sm font-medium text-gray-700 text-center overflow-x-auto scrollbar-remove">
                                        조우 실패 랜덤 문구 <br />
                                        <span id="randTen" className="text-base text-center block">
                                            {traceFailText}
                                        </span>
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
