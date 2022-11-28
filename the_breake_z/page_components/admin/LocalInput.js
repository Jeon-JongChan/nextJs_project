/* next Module */
import Script from "next/script";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";

// * react
export default function Component() {
    // autoComplete("i-local");
    async function submitLocalData() {
        let inputNameList = ["local"];
        let inputs = document.querySelectorAll(".localinput-frame input");
        let sendData = new FormData();

        for (let input of inputs) {
            for (let inputName of inputNameList) {
                if (input.id === "i2-" + inputName) {
                    sendData.append(inputName, input.value);
                }
            }
        }

        let baseurl = "http://localhost:3000/api/upload/local";
        let res = await fetch(baseurl, {
            method: "POST",
            body: sendData,
        });

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
                            <div className="localinput-frame grid grid-cols-6 gap-6">
                                <GridInputText id={"i2-local"} label={"출몰지"} smallLabel={"* 삭제할경우 필수 요인"}></GridInputText>
                                <GridInputButton label={"Delete"} buttonColor={"red"} colSpan={4}></GridInputButton>
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
