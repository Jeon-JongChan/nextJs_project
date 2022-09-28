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
        <>
            <div className="my-2">
                <GridBorderBox
                    propComponents={[InputText, InputText, InputText, InputText, InputText, InputText, InputText]}
                    propComponentsProperty={[{ label: "TEST INPUT TEXT" }, { label: "TEST INPUT TEXT" }]}
                ></GridBorderBox>
            </div>
            <AreaBorder></AreaBorder>
        </>
    );
}
