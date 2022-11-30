/* next Module */
import Script from "next/script";
import GridInputPhoto from "/page_components/Grid/GridInputPhoto";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import GridBorderBox from "/page_components/Grid/GridBorderBox";

// * react
export default function Component() {
    // autoComplete("i-local");
    async function submitPoketmonData() {
        let inputNameList = ["name", "personality", "local", "rare", "spec1", "spec2", "spec3", "levelmin", "levelmax"];
        let inputs = document.querySelectorAll(".poketmoninput-frame input");
        let iimage = document.querySelector("#i-image");
        let sendData = new FormData();

        for (let input of inputs) {
            for (let inputName of inputNameList) {
                if (input.id === "i-" + inputName) {
                    sendData.append(inputName, input.value);
                }
            }
        }

        sendData.append("image", iimage.files[0]);

        let baseurl = "http://localhost:3000/api/upload/poketmon";
        let res = await fetch(baseurl, {
            method: "POST",
            body: sendData,
        });
        iimage.file = null;
        iimage.value = null;
        iimage.dispatchEvent(new Event("change"));
        console.log("submitPoketmonData input image - ", iimage, iimage.value, " file", iimage.files[0]);
        let resData = await res.json();
        // console.log(resData);
    }
    async function deletePoketmon() {
        let inputNameList = ["name"];
        let inputs = document.querySelectorAll(".poketmoninput-frame input");
        let sendData = new FormData();

        for (let input of inputs) {
            for (let inputName of inputNameList) {
                if (input.id === "i-" + inputName) {
                    sendData.append(inputName, input.value);
                }
            }
        }

        let baseurl = "http://localhost:3000/api/delete/poketmon";
        let res = await fetch(baseurl, {
            method: "POST",
            body: sendData,
        });
        // 리스트 삭제시 화면에도 삭제

        let resData = await res.json();
        // console.log(resData);
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
                                <GridInputButton label={"Delete"} buttonColor={"red"} colSpan={4}></GridInputButton>
                                <GridInputButton type="button" colSpan={2} onclick={submitPoketmonData}></GridInputButton>
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
