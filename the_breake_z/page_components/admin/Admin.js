/* next Module */
import Script from "next/script";
import Head from "next/head";
import Nav from "/page_components/Nav";
import ImageLayerText from "/page_components/public/ImageLayerText";
import PoketmonInput from "/page_components/admin/PoketmonInput";
import PersonalityInput from "/page_components/admin/PersonalityInput";
import PoketmonListItem from "/page_components/admin/PoketmonListItem";
import LocalInput from "/page_components/admin/LocalInput";
import SpecInput from "/page_components/admin/SpecInput";
import { useState } from "react";
// * react
export default function Layout() {
    let [images, setImages] = useState([]);
    let [locals, setLocals] = useState([]);
    let [specs, setSpecs] = useState([]);
    let [personailies, setPersonailies] = useState([]);
    const syncDataList = {
        poketmon: [],
        local: [],
        spec: [],
        personality: [],
    };

    function changeTab(query) {
        let oldTab = document.querySelector(".activate-tab");
        let newTab = document.querySelector(query);
        if (oldTab) {
            oldTab.classList.add("hidden");
            oldTab.classList.remove("activate-tab");
        }
        if (newTab) {
            newTab.classList.remove("hidden");
            newTab.classList.add("block");
            newTab.classList.add("activate-tab");
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
    async function syncList(target = "poketmon") {
        let frameNode = document.querySelector("." + target + "-list");
        let targetTag = "";
        // console.log("syncList target : ", target, localData);
        if (target === "poketmon") targetTag = "img";
        else if (target === "local") targetTag = "div";
        else if (target === "spec") targetTag = "div";
        else if (target === "personality") targetTag = "div";

        if (!frameNode) {
            console.log("syncList frameNode : " + target + "-list is not found");
            return null;
        }
        localData[target] = await syncData(target, localData[target] || {}, "syncList : " + target);

        let checkData = {};
        checkData.cnt = Number(frameNode.getAttribute("data-cnt"));
        checkData.lastid = Number(frameNode.getAttribute("data-lastid"));
        checkData.update_dt = frameNode.getAttribute("data-updatedt");

        let syncDataStatus = localData[target].status;

        // 삭제된 정보가 있을경우 리스트에서 삭제해준다.
        syncDataList[target] = syncDataList[target].filter((v1, idx) => {
            let deleteCheck = false;
            localData[target].data.forEach((v2, idx) => {
                if (v1.NAME === v2.NAME) {
                    // if (target === "poketmon") console.log("status : ", v1.NAME === v2.NAME, "v1.NAME : ", v1.NAME, "v2.NAME", v2.NAME);
                    deleteCheck = true;
                }
            });
            return deleteCheck;
        });

        if (updateCheck(syncDataStatus, checkData, "syncList : " + target)) {
            let listItems = frameNode.querySelectorAll(targetTag);
            let addData = localData[target].data.filter((data, idx) => {
                // console.log("syncPoketmonList map : ", data, listItems);
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
            // if (target === "poketmon") console.log("syncList : ", target, " add data : ", ...addData, " syncDataList : ", syncDataList, " images : ", images);
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
            <Script
                src="/scripts/autoComplete.js"
                strategy="lazyOnload"
                onLoad={async () => {
                    console.log("Layout lazyOnload");
                    if (typeof localData === undefined) {
                        console.log("localData undefined!. 1초간 대기합니다.");
                        await sleep(2000);
                    }
                    syncList("poketmon");
                    syncList("local");
                    syncList("spec");
                    syncList("personality");
                    setInterval(() => syncList("poketmon"), 10000);
                    setInterval(() => syncList("local"), 10000);
                    setInterval(() => syncList("spec"), 10000);
                    setInterval(() => syncList("personality"), 10000);

                    localData = await initAutoComplete("i-name", "poketmon", localData);
                    localData = await initAutoComplete("i-personality", "personality", localData);
                    localData = await initAutoComplete("i-local", "local", localData);
                    localData = await initAutoComplete("i-spec1", "spec", localData);
                    localData = await initAutoComplete("i-spec2", "spec", localData);
                    localData = await initAutoComplete("i-spec3", "spec", localData);
                    localData = await initAutoComplete("i2-name", "local", localData);
                    localData = await initAutoComplete("i3-name", "spec", localData);
                    localData = await initAutoComplete("i4-name", "personality", localData);
                }}
            />
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

                                <div className="poketmon-list grid grid-cols-1 gap-y-10 gap-x-6" data-cnt={0} data-lastid={0} data-updatedt={""}>
                                    {images.length > 0
                                        ? images.map((data, idx, array) => {
                                              //   console.log("poketmonImages data : ", data, array);
                                              return <ImageLayerText key={idx} imageSrc={data.PATH} imageAlt={data.NAME} onclick={clickPoketmonList}></ImageLayerText>;
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
                                <div className="personality-list grid grid-cols-1 gap-y-1 gap-x-6 max-h-screen min-w-full" data-cnt={0} data-lastid={0}>
                                    {personailies.length > 0 ? personailies.map((data, idx, array) => <PoketmonListItem key={idx} label={data.NAME} count={data.POKETMON_CNT}></PoketmonListItem>) : ""}
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
                                <div className="local-list grid grid-cols-1 gap-y-1 gap-x-6 max-h-screen min-w-full" data-cnt={0} data-lastid={0}>
                                    {locals.length > 0 ? locals.map((data, idx, array) => <PoketmonListItem key={idx} label={data.NAME} count={data.POKETMON_CNT}></PoketmonListItem>) : ""}
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
                                <div className="spec-list grid grid-cols-1 gap-y-1 gap-x-6 max-h-screen min-w-full" data-cnt={0} data-lastid={0}>
                                    {specs.length > 0 ? specs.map((data, idx, array) => <PoketmonListItem key={idx} label={data.NAME} count={data.POKETMON_CNT}></PoketmonListItem>) : ""}
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
