/* next Module */
import Script from "next/script";
import InputPhoto from "./Grid/GridInputPhoto";
import InputText from "./Grid/GridInputText";
import InputSelectBox from "./Grid/GridInputSelectBox";
import AreaBorder from "./public/AreaBorder";
import InputButton from "./Grid/GridInputButton";
import GridBorderBox from "./Grid/GridBorderBox";

// * react
export default function Component() {
    // autoComplete("i-local");
    async function submitPoketmonData() {
        let iname = document.querySelector("#i-name");
        let ilocal = document.querySelector("#i-local");
        let irare = document.querySelector("#i-rare");
        let ispec1 = document.querySelector("#i-spec1");
        let ispec2 = document.querySelector("#i-spec2");
        let ispec3 = document.querySelector("#i-spec3");
        let ilevelmin = document.querySelector("#i-level-min");
        let ilevelmax = document.querySelector("#i-level-max");
        let iimage = document.querySelector("#i-image");

        let sendData = new FormData();
        sendData.append("name", iname.value);
        sendData.append("local", ilocal.value);
        sendData.append("rare", irare.value);
        sendData.append("spec1", ispec1.value);
        sendData.append("spec2", ispec2.value);
        sendData.append("spec3", ispec3.value);
        sendData.append("levelmin", ilevelmin.value);
        sendData.append("levelmax", ilevelmax.value);
        sendData.append("image", iimage.files[0]);

        let baseurl = "http://localhost:3000/api/upload/poketmon";

        let res = await fetch(baseurl, {
            method: "POST",
            body: sendData,
        });

        let resData = await res.json();
        console.log(resData);
    }
    /**
     * 포켓몬 리스트를 출력하는 함수
     */
    async function syncPoketmonList() {
        let frameNode = document.querySelector("poketmon-list");
    }
    return (
        <>
            <Script
                src="/scripts/autoComplete.js"
                strategy="lazyOnload"
                onLoad={async () => {
                    if (typeof localData === undefined) {
                        console.log("localData undefined!. 1초간 대기합니다.");
                        sleep(2000);
                    }
                    localData = await initAutoComplete("i-name", "poketmon", localData);
                    localData = await initAutoComplete("i-local", "local", localData);
                    localData = await initAutoComplete("i-spec1", "spec", localData);
                    localData = await initAutoComplete("i-spec2", "spec", localData);
                    localData = await initAutoComplete("i-spec3", "spec", localData);
                }}
            />
            <div className="flex flex-col w-full">
                <div className="my-2">
                    {/* <div className="md:grid md:grid-cols-8 md:gap-6">
                        <div className="mt-5 md:col-span-8 md:mt-0"> */}
                    <div className="shadow rounded-md">
                        <div className="bg-white px-4 py-3">
                            <div className="grid grid-cols-6 gap-6">
                                <InputText id={"i-name"} label={"포켓폰 이름"} smallLabel={"* 삭제할경우 필수 요인"}></InputText>
                                <InputText id={"i-local"} label={"출몰지"} colSpan={3}></InputText>
                                <InputText id={"i-rare"} label={"출현율"} colSpan={3}></InputText>
                                <InputText id={"i-spec1"} label={"특성 1"} colSpan={2}></InputText>
                                <InputText id={"i-spec2"} label={"특성 2"} colSpan={2}></InputText>
                                <InputText id={"i-spec3"} label={"HIDDEN 특성"} colSpan={2}></InputText>
                                <InputText id={"i-level-min"} label={"최소레벨"} colSpan={3} default={1}></InputText>
                                <InputText id={"i-level-max"} label={"최대레벨"} colSpan={3} default={50}></InputText>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-2">
                    <GridBorderBox propComponent={InputPhoto} propComponentProperty={{ label: "포켓몬 사진", id: "i-image" }}></GridBorderBox>
                    <div className="shadow rounded-md">
                        <div className="bg-white px-4 py-3">
                            <div className="grid grid-cols-6 gap-6">
                                <InputButton label={"Delete"} buttonColor={"red"} colSpan={4}></InputButton>
                                <InputButton type="button" colSpan={2} onclick={submitPoketmonData}></InputButton>
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
