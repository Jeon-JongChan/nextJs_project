/* next Module */
import { changeTab, copyToClipBoard, syncData, getRandomInt } from "/scripts/client/client";
import { autoComplete, initAutoComplete } from "/scripts/client/autoComplete";
import Nav from "/page_components/Nav";
import GridInputPhoto from "/page_components/Grid/GridInputPhoto";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import GridBorderBox from "/page_components/Grid/GridBorderBox";
import { useState } from "react";
// * react
export default function Layout() {
    const [researchImage, setResearchImage] = useState("");
    const [rand, setRand] = useState(0);
    const [randTen, setRandTen] = useState(0);
    const [randIntervalTime, setRandIntervalTime] = useState(3000);
    const [randTenIntervalTime, setRandTenIntervalTime] = useState(3000);
    const localData = {};

    function syncDataInterval() {
        let syncList = ["poketmon", "local"];
        console.log("Battle syncDataInterval", localData);
        try {
            syncList.forEach(async (element) => {
                localData[element] = await syncData(element, localData?.[element] || {}, "Battle syncDataInterval");
                // console.log("syncDataInterval : ", element, localData[element]);
            });
        } catch (e) {
            console.log("Battle syncDataInterval error. localData :", localData, e.message);
        }
    }

    async function initBattle() {
        try {
            // intervalRand()();
            // syncDataInterval();
            // setInterval(syncDataInterval, 100000);
            await initAutoComplete("i-research-local", "local", localData);
            await initAutoComplete("i-research-poketmon", "poketmon", localData);
        } catch (e) {
            console.log("Battle setInterval error. localData :", localData, e.message);
        }
    }
    initBattle();
    // 리서치 부분 함수들
    function intervalRand() {
        let randInterval;
        let randTenInterval;
        return () => {
            clearInterval(randInterval);
            clearInterval(randTenInterval);

            randInterval = setInterval(() => {
                let random = getRandomInt(1, 100 + 1);
                setRand(random);
            }, randIntervalTime);

            randTenInterval = setInterval(() => {
                let random = getRandomInt(10, 200 + 1);
                setRandTen(random);
            }, randTenIntervalTime);
        };
    }
    function createTextResearch() {
        let targetList = ["trainer", "poketmon", "spec", "level", "personality", "music"];
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
        console.log(inputs, inputValues, detailData, localData);
        targetList.forEach((element) => {
            let targetNodes = document.querySelectorAll(".pre-research spen[data-name='" + element + "']");
            targetNodes.forEach((node) => {
                // console.log("createTextResearch targetNodes " + element, " inputValues ", inputValues, inputValues[element]);
                node.innerText = inputValues[element];
            });
        });

        setResearchImage(detailData?.PATH || "");
    }
    // 공용 함수
    function findLocalDataByName(name, data) {
        let ret = {};
        for (let i = 0; i < data.length; i++) {
            console.log("findLocalDataByName ", data[i].NAME, name, data[i].NAME === name);
            if (data[i].NAME === name) {
                ret = data[i];
                return ret;
            }
        }
        return;
    }
    return (
        <>
            <Nav></Nav>
            <div className="mt-2">
                <ul className="flex items-center justify-center space-x-4">
                    <button onClick={() => changeTab("#adminpage-addPoketmon")}>
                        <li className="apply-tab-item">포켓몬</li>
                    </button>
                    <button onClick={() => changeTab("#adminpage-addPersonality")}>
                        <li className="apply-tab-item">리서치</li>
                    </button>
                    <button onClick={() => changeTab("#adminpage-addLocal")}>
                        <li className="apply-tab-item">야생배틀</li>
                    </button>
                    <button onClick={() => changeTab("#adminpage-addSpec")}>
                        <li className="apply-tab-item">로드배틀</li>
                    </button>
                </ul>
            </div>
            <div id="battlepage-research" className="activate-tab">
                <div className="flex mt-4">
                    <div className="flex flex-col w-1/3">
                        <div className="bg-white">
                            <div className="mx-auto py-2 px-2">
                                <div className="flex flex-col w-full">
                                    <div className="my-2">
                                        {/* <div className="md:grid md:grid-cols-8 md:gap-6">
                        <div className="mt-5 md:col-span-8 md:mt-0"> */}
                                        <div className="shadow rounded-md">
                                            <div className="bg-white px-4 py-3">
                                                <div className="research-frame grid grid-cols-6 gap-6">
                                                    <GridInputText id={"i-research-trainer"} dataName={"trainer"} colSpan={3} label={"트레이너"}></GridInputText>
                                                    <GridInputText id={"i-research-local"} dataName={"local"} colSpan={3} label={"조사지역"}></GridInputText>
                                                    <GridInputText id={"i-research-poketmon"} dataName={"poketmon"} colSpan={3} label={"선택 포켓몬"}></GridInputText>
                                                    <GridInputText
                                                        id={"i-research-music"}
                                                        dataName={"music"}
                                                        colSpan={3}
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
                                                    <GridInputButton
                                                        label={"Copy"}
                                                        buttonColor={"zinc"}
                                                        onclick={() => copyToClipBoard(".pre-research")}
                                                        colSpan={3}
                                                        type="button"
                                                    ></GridInputButton>
                                                    <GridInputButton label={"생성"} type="button" onclick={createTextResearch} colSpan={3}></GridInputButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="shadow rounded-md px-4 py-3">
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
                                        <div className="shadow rounded-md p-2 text-sm font-medium text-gray-700">난수 생성 ( 1 ~ 100 )</div>
                                        <div className="shadow rounded-md">
                                            <span>{rand}</span>
                                        </div>
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
