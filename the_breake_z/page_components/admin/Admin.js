/* next Module */
import Script from "next/script";
import Head from "next/head";
import Nav from "/page_components/Nav";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import ImageLayerText from "/page_components/public/ImageLayerText";
import PoketmonInput from "/page_components/admin/PoketmonInput";
import { useState } from "react";
// * react
export default function Layout() {
    let [images, setImages] = useState([]);
    let imageData = [];

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
    async function syncPoketmonList() {
        let frameNode = document.querySelector(".poketmon-list");
        if (!frameNode) return null;
        localData.poketmon = await syncData("poketmon", localData.poketmon || {}, "syncPoketmonList");

        let checkData = {};
        checkData.cnt = Number(frameNode.getAttribute("data-cnt"));
        checkData.lastid = Number(frameNode.getAttribute("data-lastid"));
        checkData.update_dt = frameNode.getAttribute("data-updatedt");

        let poketmonStatus = localData.poketmon.status;

        if (updateCheck(poketmonStatus, checkData, "syncPoketmonList")) {
            let listItems = frameNode.querySelectorAll("img");
            let addData = localData.poketmon.data.filter((data, idx) => {
                // console.log("syncPoketmonList map : ", data, listItems);
                let name = data.NAME;
                let addCheck = true;

                // 정보 업데이트를 대비한 정보 업데이트
                for (let v of imageData) {
                    if (v.NAME === data.NAME) {
                        console.log("syncPoketmonList v : ", v.NAME, v, " data : ", data.NAME, data);
                        v = data;
                        break;
                    }
                }
                for (let v of listItems) {
                    let alt = v.getAttribute("alt");
                    if (alt === name) {
                        console.log("syncPoketmonList 이미지 업데이트: ", v, data, idata);
                        if (v.src !== data.PATH) v.src = data.PATH; // 이미지 변경을 했을때 이미지 교체
                        addCheck = false;
                        break;
                    }
                }

                if (addCheck) {
                    return data;
                }
            });
            if (addData) {
                // 아무래도 js 밖에서 돌리다 보니 제대로된 저장이 안되는 느낌
                imageData = [...imageData, ...addData];
                setImages([...imageData]);
                frameNode.setAttribute("data-cnt", poketmonStatus.cnt);
                frameNode.setAttribute("data-lastid", poketmonStatus.lastid);
                frameNode.setAttribute("data-updatedt", poketmonStatus.update_dt);
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
                    syncPoketmonList();
                    setInterval(syncPoketmonList, 10000);

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
                            <div className="mx-auto max-w-2xl py-4 px-4">
                                <h2 className="sr-only">Products</h2>

                                <div className="poketmon-list grid grid-cols-4 gap-y-10 gap-x-6" data-cnt={0} data-lastid={0} data-updatedt={""}>
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
                            <div className="mx-auto max-w-2xl py-2 px-4">
                                <h2 className="sr-only">Products</h2>

                                <div className="poketmon-list grid grid-cols-3 gap-y-10 gap-x-6 min-h-screen min-w-full" data-cnt={0} data-lastid={0}>
                                    <div className="shadow rounded-md col-span-1 max-h-10 p-2 text-center">
                                        <span className="">text</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="flex flex-row w-2/5">
                        <div className="flex flex-col w-full">
                            <div className="my-2">
                                {/* <div className="md:grid md:grid-cols-8 md:gap-6">
                        <div className="mt-5 md:col-span-8 md:mt-0"> */}
                                <div className="shadow rounded-md">
                                    <div className="bg-white px-4 py-3">
                                        <div className="poketmoninput-frame grid grid-cols-6 gap-6">
                                            <GridInputText id={"i2-local"} label={"출몰지"} smallLabel={"* 삭제할경우 필수 요인"}></GridInputText>
                                            <GridInputButton label={"Delete"} buttonColor={"red"} colSpan={4}></GridInputButton>
                                            <GridInputButton type="button" colSpan={2}></GridInputButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
