/* next Module */
import Script from "next/script";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import { LocalDataContext, HostContext, AdminSyncContext } from "/page_components/MyContext";
import { useContext, useEffect } from "react";
import { initAutoComplete } from "/scripts/client/autoComplete";
import { submitAdminData, submitAdminDelete } from "/scripts/client/client";
// * react
export default function Component() {
    let localData = useContext(LocalDataContext);
    const host = useContext(HostContext);
    const adminSync = useContext(AdminSyncContext);
    const target = "personality";
    const idUniqueTag = "i4-";

    useEffect(() => {
        setTimeout(init, 1000);
    }, []);

    function clickSubmit() {
        let inputNameList = ["name"];
        submitAdminData(target, inputNameList, idUniqueTag, adminSync);
    }
    function clickDelete() {
        submitAdminDelete(target, idUniqueTag, adminSync);
    }

    async function init() {
        localData = await initAutoComplete("i4-name", "personality", localData);
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="my-2">
                    {/* <div className="md:grid md:grid-cols-8 md:gap-6">
                        <div className="mt-5 md:col-span-8 md:mt-0"> */}
                    <div className="shadow rounded-md">
                        <div className="bg-white px-4 py-3">
                            <div className="personalityinput-frame grid grid-cols-6 gap-6">
                                <GridInputText id={"i4-name"} label={"성격"} smallLabel={"* 삭제할경우 필수 요인"}></GridInputText>
                                <GridInputButton label={"Delete"} buttonColor={"red"} colSpan={4} type="button" onclick={clickDelete}></GridInputButton>
                                <GridInputButton type="button" colSpan={2} onclick={clickSubmit}></GridInputButton>
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
