/* next Module */
import Script from "next/script";
import InputPhoto from "./input/GridInputPhoto";
import InputButton from "./input/GridInputButton";
import InputText from "./input/GridInputText";
import InputSelectBox from "./input/GridInputSelectBox";
import AreaBorder from "./public/AreaBorder";
import GridBorderBox from "./public/GridBorderBox";

// * react
export default function Component() {
    /**
     * 입력칸에 데이터를 입력할 경우 자동완성 드롭다운 창이 보이게 하는 함수
     * @param {string} id
     */
    async function autoComplete(id, data = null) {
        let dom = document.querySelector("#" + id);
        let target = id == "i-local" ? "local" : "spec";
        let apiurl = "http://localhost:3000/api/data";
        let res = await fetch(apiurl, {
            method: "POST",
            body: JSON.stringify({ target: target }),
        });
        data = await res.json();

        console.log("data : ", data);
    }
    /**
     *
     * @returns
     */
    function createAutoCompleteDom() {
        // 자동완성 드롭다운에 필요한 dom 생성
        let dropFrame = document.createElement("div");
        let dropInnerFrame = document.createElement("div");
        let dropButton = document.createElement("button");
        // 자동완성 드롭다운 배치
        dropInnerFrame.appendChild(dropButton);
        dropFrame.appendChild(dropInnerFrame);
        // dom에 필요한 필수 속성 추가(tailwind 사용중)
        dropFrame.className = "absolute right-0 z-10 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-90";
        dropInnerFrame.className = "py-1";
        dropButton.className = "text-gray-700 block w-full px-4 py-2 text-left text-sm";
        dropButton.type = "submit";

        return [dropFrame, dropInnerFrame, dropButton];
    }

    <div className="py-1" role="none">
        <button type="submit" className="" role="menuitem" tabindex="-1" id="menu-item-3">
            Sign out
        </button>
    </div>;

    autoComplete("i-local");
    return (
        <div className="flex flex-col w-full">
            <div className="my-2">
                <div className="md:grid md:grid-cols-8 md:gap-6">
                    <div className="mt-5 md:col-span-8 md:mt-0">
                        <div className="shadow rounded-md">
                            <div className="bg-white px-4 py-3">
                                <div className="grid grid-cols-6 gap-6">
                                    <InputText id={"i-name"} label={"포켓폰 이름"}></InputText>
                                    <InputText id={"i-local"} label={"출몰지"} colSpan={3}></InputText>
                                    <InputText id={"i-rare"} label={"출현율"} colSpan={3}></InputText>
                                    <InputText id={"i-spec1"} label={"특성 1"} colSpan={3}></InputText>
                                    <InputText id={"i-spec2"} label={"특성 2"} colSpan={3}></InputText>
                                    <InputText id={"i-spec3"} label={"HIDDEN 특성"}></InputText>
                                    <InputText id={"i-level-min"} label={"최소레벨"} colSpan={3} default={1}></InputText>
                                    <InputText id={"i-level-max"} label={"최대레벨"} colSpan={3} default={50}></InputText>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-2">
                <GridBorderBox propComponent={InputPhoto} propComponentProperty={{ label: "포켓몬 사진" }}></GridBorderBox>
            </div>
        </div>
    );
}
