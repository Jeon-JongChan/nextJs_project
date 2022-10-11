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
    // autoComplete("i-local");
    return (
        <>
            <Script
                src="/scripts/autoComplete.js"
                strategy="lazyOnload"
                onLoad={() => {
                    localData = autoComplete("i-spec1", localData);
                }}
            />
            <div className="hidden">
                <div class="relative h-80 overflow-y-scroll py-1 right-0 z-10 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-90"></div>
            </div>
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
        </>
    );
}
