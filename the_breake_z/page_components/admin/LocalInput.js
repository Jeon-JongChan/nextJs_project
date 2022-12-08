/* next Module */
import Script from "next/script";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import { useContext, useEffect } from "react";
import { LocalDataContext, HostContext } from "/page_components/MyContext";
import { initAutoComplete } from "/scripts/client/autoComplete";
import { changeTab, copyToClipBoard, syncData, getRandomInt, asyncInterval, sleep, findLocalDataByName } from "/scripts/client/client";
// * react
export default function Component() {
    let localData = useContext(LocalDataContext);
    let host = useContext(HostContext);
    const target = "local";

    useEffect(() => {
        setTimeout(init, 1000);
    }, []);

    async function submitLocalData() {
        let inputNameList = ["name"];
        let inputs = document.querySelectorAll("." + target + "input-frame input");
        let sendData = new FormData();

        for (let input of inputs) {
            for (let inputName of inputNameList) {
                if (input.id === "i2-" + inputName) {
                    sendData.append(inputName, input.value);
                }
            }
        }

        let baseurl = host + "/api/upload/" + target;
        let res = await fetch(baseurl, {
            method: "POST",
            body: sendData,
        });

        let resData = await res.json();
        // console.log(resData);
    }
    async function deleteLocal() {
        let target = "local";
        let input = document.querySelector("." + target + "input-frame #i2-name");

        let baseurl = host + "/api/delete/" + target;
        let res = await fetch(baseurl, {
            method: "POST",
            body: JSON.stringify({
                name: input.value,
            }),
        });
        // 리스트 삭제시 화면에도 삭제

        let resData = await res.json();
        // console.log(resData);
    }
    async function init() {
        localData = await initAutoComplete("i2-name", "local", localData);
    }

    setTimeout(init, 1000);
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="my-2">
                    {/* <div className="md:grid md:grid-cols-8 md:gap-6">
                        <div className="mt-5 md:col-span-8 md:mt-0"> */}
                    <div className="shadow rounded-md">
                        <div className="bg-white px-4 py-3">
                            <div className="localinput-frame grid grid-cols-6 gap-6">
                                <GridInputText id={"i2-name"} label={"출몰지"} smallLabel={"* 삭제할경우 필수 요인"}></GridInputText>
                                <GridInputButton label={"Delete"} buttonColor={"red"} colSpan={4} type="button" onclick={deleteLocal}></GridInputButton>
                                <GridInputButton type="button" colSpan={2} onclick={submitLocalData}></GridInputButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
/**
 * 할당해야될 tawind 모듈 임포트를 위해 선언
 */
const tawind = {
    visible: "visible",
    invisible: "invisible",
};
