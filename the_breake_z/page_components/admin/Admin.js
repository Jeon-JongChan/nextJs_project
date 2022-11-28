/* next Module */
import Script from "next/script";
import Head from "next/head";
import Nav from "/page_components/Nav";
import ImageLayerText from "/page_components/public/ImageLayerText";
import PoketmonInput from "/page_components/admin/PoketmonInput";
import LocalInput from "/page_components/admin/LocalInput";
import { useState } from "react";
// * react
export default function Layout() {
    let [images, setImages] = useState([]);
    let [locals, setLocals] = useState([]);
    let [specs, setSpecs] = useState([]);
    const syncDataList = {
        poketmon: [],
        local: [],
        spec: [],
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

        let inputNameList = ["name", "local", "rare", "spec1", "spec2", "spec3", "levelmin", "levelmax"];
        let dataNameObject = { name: "NAME", local: "LOCAL", rare: "RARE", spec1: "SPEC1", spec2: "SPEC2", spec3: "SPEC3", levelmin: "LEVEL_MIN", levelmax: "LEVEL_MAX" };
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
     * 포켓몬 추가탭에 이미지를 계속 갱신해서 보여준다.
     */
    async function syncList(target = "poketmon") {
        let frameNode = document.querySelector("." + target + "-list");
        if (!frameNode || !localData?.[target]) return null;
        localData[target] = await syncData(target, localData[target] || {}, "syncList : " + target);

        let checkData = {};
        checkData.cnt = Number(frameNode.getAttribute("data-cnt"));
        checkData.lastid = Number(frameNode.getAttribute("data-lastid"));
        checkData.update_dt = frameNode.getAttribute("data-updatedt");

        let syncDataStatus = localData[target].status;

        if (updateCheck(syncDataStatus, checkData, "syncList : " + target)) {
            let listItems = frameNode.querySelectorAll("img");
            let addData = localData[target].data.filter((data, idx) => {
                // console.log("syncPoketmonList map : ", data, listItems);
                let name = data.NAME;
                let addCheck = true;

                // 정보 업데이트를 대비한 정보 업데이트
                syncDataList[target].forEach((v, idx) => {
                    if (v.NAME === data.NAME) syncDataList[target][idx] = data;
                });

                for (let v of listItems) {
                    let alt = v.getAttribute("alt");
                    if (alt === name) {
                        addCheck = false;
                        break;
                    }
                }

                if (addCheck) {
                    return data;
                }
            });
            console.log("syncList : ", target, " end : ", syncDataList[target]);
            if (addData) {
                // 아무래도 js 밖에서 돌리다 보니 제대로된 저장이 안되는 느낌
                syncDataList[target] = [...syncDataList[target], ...addData];
                if (target === "poketmon") setImages([...syncDataList[target]]);
                else if (target === "local") setLocals([...syncDataList[target]]);
                else if (target === "spec") setSpecs([...syncDataList[target]]);
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
                        sleep(2000);
                    }
                    syncList("poketmon");
                    syncList("local");
                    setInterval(() => syncList("poketmon"), 10000);
                    setInterval(() => syncList("local"), 10000);

                    localData = await initAutoComplete("i-name", "poketmon", localData);
                    localData = await initAutoComplete("i-local", "local", localData);
                    localData = await initAutoComplete("i-spec1", "spec", localData);
                    localData = await initAutoComplete("i-spec2", "spec", localData);
                    localData = await initAutoComplete("i-spec3", "spec", localData);
                }}
            />
            <Nav></Nav>
            <div className="mt-2">
                <ul className="flex items-center justify-center space-x-4">
                    <button
                        onClick={() => {
                            changeTab("#adminpage-addPoketmon");
                        }}
                    >
                        <li className="apply-tab-item">포켓몬 추가</li>
                    </button>
                    <button
                        onClick={() => {
                            changeTab("#adminpage-addLocal");
                        }}
                    >
                        <li className="apply-tab-item">포켓몬 지역</li>
                    </button>
                    <button
                        onClick={() => {
                            changeTab("#adminpage-addSpec");
                        }}
                    >
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

                                <div className="poketmon-list grid grid-cols-5 gap-y-10 gap-x-6" data-cnt={0} data-lastid={0} data-updatedt={""}>
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
            <div id="adminpage-addLocal" className="activate-tab">
                <div className="flex mt-4">
                    <div className="flex flex-col w-3/5">
                        <div className="bg-white">
                            <div className="mx-auto py-2 px-4">
                                <h2 className="sr-only">Products</h2>

                                <div className="local-list grid grid-cols-3 gap-y-1 gap-x-6 max-h-screen min-w-full" data-cnt={0} data-lastid={0}>
                                    {locals.length > 0
                                        ? locals.map((data, idx, array) => {
                                              //   console.log("poketmonImages data : ", data, array);
                                              return (
                                                  <div key={idx} className="shadow rounded-md col-span-1 max-h-10 p-2 text-center">
                                                      <span>
                                                          {data.NAME} {data.POKETMON_CNT > 0 ? <span className="text-sm font-bold">({data.POKETMON_CNT})</span> : ""}
                                                      </span>
                                                  </div>
                                              );
                                          })
                                        : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="flex flex-row w-2/5">
                        <LocalInput></LocalInput>
                    </form>
                </div>
            </div>
        </>
    );
}
