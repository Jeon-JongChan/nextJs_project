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
    return (
        <div className="flex flex-col w-full">
            <div className="my-2">
                <div className="md:grid md:grid-cols-8 md:gap-6">
                    <div className="mt-5 md:col-span-8 md:mt-0">
                        <div className="shadow sm:overflow-hidden sm:rounded-md">
                            <div className="bg-white px-4 py-3">
                                <div className="grid grid-cols-6 gap-6">
                                    <InputText label={"포켓폰 이름"}></InputText>
                                    <InputText label={"출몰지"} colSpan={3}></InputText>
                                    <InputText label={"출현율"} colSpan={3}></InputText>
                                    <InputText label={"특성 1"} colSpan={3}></InputText>
                                    <InputText label={"특성 2"} colSpan={3}></InputText>
                                    <InputText label={"HIDDEN 특성"}></InputText>
                                    <InputText label={"최소레벨"} colSpan={3} default={1}></InputText>
                                    <InputText label={"최대레벨"} colSpan={3} default={50}></InputText>
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
