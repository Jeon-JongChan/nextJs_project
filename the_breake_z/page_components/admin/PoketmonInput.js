/* next Module */
import GridInputPhoto from "/page_components/Grid/GridInputPhoto";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import GridBorderBox from "/page_components/Grid/GridBorderBox";
import { useContext, useEffect } from "react";
import { LocalDataContext, HostContext, AdminSyncContext } from "/page_components/MyContext";
import { initAutoComplete } from "/scripts/client/autoComplete";
import { devLog } from "/scripts/common";
import { submitAdminDelete } from "/scripts/client/client";

// * react
export default function Component() {
    let localData = useContext(LocalDataContext);
    const host = useContext(HostContext);
    let adminSync = useContext(AdminSyncContext);
    const target = "poketmon";
    const idUniqueTag = "i-";

    useEffect(() => {
        setTimeout(init, 1000);
    }, []);
    // autoComplete("i-local");
    async function submitPoketmonData() {
        let inputNameList = ["name", "personality", "local", "rare", "spec1", "spec2", "spec3", "levelmin", "levelmax"];
        let inputs = document.querySelectorAll(".poketmoninput-frame input");
        let iimage = document.querySelector("#i-image");
        let imageFrame = document.querySelector(".gridinputphoto-frame");
        let sendData = new FormData();

        for (let input of inputs) {
            for (let inputName of inputNameList) {
                if (input.id === "i-" + inputName) {
                    sendData.append(inputName, input.value);
                }
            }
        }

        sendData.append("image", iimage.files[0]);
        let baseurl = host + "/api/upload/poketmon";
        let res = await fetch(baseurl, {
            method: "POST",
            body: sendData,
        });
        iimage.file = null;
        iimage.value = null;
        imageFrame.style.backgroundImage = "url()";
        iimage.dispatchEvent(new Event("change"));
        devLog("submitPoketmonData input image - ", iimage, iimage.value, " file", iimage.files[0]);

        adminSync.current = target;
    }
    function clickDelete() {
        submitAdminDelete(target, idUniqueTag, adminSync);
    }
    async function init() {
        localData = await initAutoComplete("i-name", "poketmon", localData);
        localData = await initAutoComplete("i-personality", "personality", localData);
        localData = await initAutoComplete("i-local", "local", localData);
        localData = await initAutoComplete("i-spec1", "spec", localData);
        localData = await initAutoComplete("i-spec2", "spec", localData);
        localData = await initAutoComplete("i-spec3", "spec", localData);
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="my-2">
                    {/* <div className="md:grid md:grid-cols-8 md:gap-6">
                        <div className="mt-5 md:col-span-8 md:mt-0"> */}
                    <div className="shadow rounded-md">
                        <div className="bg-white px-4 py-3">
                            <div className="poketmoninput-frame grid grid-cols-6 gap-6">
                                <GridInputText id={"i-name"} label={"포켓폰 이름"} colSpan={3} smallLabel={"* 삭제할경우 필수 요인"}></GridInputText>
                                <GridInputText id={"i-personality"} label={"성격"} colSpan={3}></GridInputText>
                                <GridInputText id={"i-local"} label={"출몰지"} colSpan={3}></GridInputText>
                                <GridInputText id={"i-rare"} label={"출현율"} colSpan={3}></GridInputText>
                                <GridInputText id={"i-spec1"} label={"특성 1"} colSpan={2}></GridInputText>
                                <GridInputText id={"i-spec2"} label={"특성 2"} colSpan={2}></GridInputText>
                                <GridInputText id={"i-spec3"} label={"HIDDEN 특성"} colSpan={2}></GridInputText>
                                <GridInputText id={"i-levelmin"} label={"최소레벨"} colSpan={3} default={1}></GridInputText>
                                <GridInputText id={"i-levelmax"} label={"최대레벨"} colSpan={3} default={50}></GridInputText>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-2">
                    <GridBorderBox propComponent={GridInputPhoto} propComponentProperty={{ label: "포켓몬 사진", id: "i-image" }}></GridBorderBox>
                    <div className="shadow rounded-md">
                        <div className="bg-white px-4 py-3">
                            <div className="grid grid-cols-6 gap-6">
                                <GridInputButton label={"Delete"} buttonColor={"red"} colSpan={3} type="button" onclick={clickDelete}></GridInputButton>
                                <GridInputButton type="button" colSpan={3} onclick={submitPoketmonData}></GridInputButton>
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
