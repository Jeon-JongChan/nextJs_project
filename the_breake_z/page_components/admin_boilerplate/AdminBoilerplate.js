/* next Module */
import Nav from "/page_components/Nav";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import BoilerplateInput from "./BoilerplateInput";
import { LocalDataContext, HostContext, AdminSyncContext } from "/page_components/MyContext";
import { useContext, useEffect } from "react";
import { initAutoComplete } from "/scripts/client/autoComplete";
import { changeTab, submitAdminData, submitAdminDelete } from "/scripts/client/client";
// * react
export default function Layout() {
    // const pageList = [{name : '리서치', "research","wildbattle"]
    return (
        <>
            <Nav></Nav>
            <div className="mt-2">
                <ul className="flex items-center justify-center space-x-4">
                    <button onClick={() => changeTab("#adminpage-addBoilerplate")}>
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
            <div id="adminpage-addBoilerplate" className="activate-tab">
                <div className="flex mt-4">
                    <div className="flex flex-col w-3/5">
                        <div className="bg-white">
                            <div className="mx-auto py-2 px-4">
                                <h2 className="sr-only">Products</h2>
                                <div className="personality-list grid grid-cols-1 gap-y-1 gap-x-6 max-h-screen min-w-full" data-cnt={0} data-lastid={0}>
                                    {/* {personailies.length > 0 ? personailies.map((data, idx, array) => <PoketmonListItem key={idx} label={data.NAME} count={data.POKETMON_CNT}></PoketmonListItem>) : ""} */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="flex flex-row w-2/5">
                        <BoilerplateInput></BoilerplateInput>
                    </form>
                </div>
            </div>
        </>
    );
}
