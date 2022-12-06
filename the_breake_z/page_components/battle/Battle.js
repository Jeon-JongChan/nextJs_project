/* next Module */
import { changeTab, copyToClipBoard } from "/scripts/client/client";
import GridInputPhoto from "/page_components/Grid/GridInputPhoto";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import GridBorderBox from "/page_components/Grid/GridBorderBox";
// * react
export default function Layout() {
    return (
        <>
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
            <div id="adminpage-addPoketmon" className="activate-tab">
                <div className="flex mt-4">
                    <div className="flex flex-col w-1/3">
                        <div className="bg-white">
                            <div className="mx-auto py-4 px-4">
                                <div className="flex flex-col w-full">
                                    <div className="my-2">
                                        {/* <div className="md:grid md:grid-cols-8 md:gap-6">
                        <div className="mt-5 md:col-span-8 md:mt-0"> */}
                                        <div className="shadow rounded-md">
                                            <div className="bg-white px-4 py-3">
                                                <div className="poketmoninput-frame grid grid-cols-6 gap-6">
                                                    <GridInputText id={"i-research-trainer"} colSpan={3} label={"트레이너"}></GridInputText>
                                                    <GridInputText id={"i-research-local"} colSpan={3} label={"조사지역"}></GridInputText>
                                                    <GridInputText id={"i-research-poketmon"} colSpan={3} label={"선택 포켓몬"}></GridInputText>
                                                    <GridInputText id={"i-research-music"} colSpan={3} label={"유투브 음악주소"}></GridInputText>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="shadow rounded-md">
                                            <div className="bg-white px-4 py-3">
                                                <div className="grid grid-cols-6 gap-6">
                                                    <GridInputButton label={"Copy"} buttonColor={"zinc"} colSpan={3} type="button"></GridInputButton>
                                                    <GridInputButton label={"생성"} type="button" colSpan={3}></GridInputButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <pre>
                                            🎵 https://youtu.be/D7bYpd7Wiis 앗, 야생의 (성격) (포켓몬 이름) 이(가) 나타났다! (포켓몬 이름) Lv.○○ [특성] ..무엇을 할까 로토? ▷
                                            배틀한다 ▷ 포획한다 ▷ 도망간다
                                        </pre>
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
