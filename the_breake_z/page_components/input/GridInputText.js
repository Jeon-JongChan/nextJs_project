/* next Module */
import Script from "next/script";
// * react
/**
 *
 * @param {string} [label=Input Text] - 라벨에 출력할 Inner Text
 * @param {string} [inputId=input-text] - input tag에 들어갈 ID (name 속성에도 들어감)
 * @param {string} [autoComplete=on] - input 자동완성 옵션
 * @param {int} [colSpenValue=6] - input 넓이(Grid Column 기준)
 * @param {int} [colSmSpenValue=4] - 최소 width(640px) 기준 input 넓이(Grid Column 기준)
 */
export default function Component(props) {
    let label = props?.label || "Input Text";
    let inputId = props?.id || "input-text";
    let colSpenValue = props?.colSpan || 6;
    let colSmSpenValue = props?.colSmSpan || 4;
    let autoComplete = autoCompleteType.find((e) => e === props?.autoComplete) || "on";
    let dirmode = props?.dirmode || "col";
    let rowWidth = props?.rowWidth || "w-2/5";
    return (
        <>
            {/* <div className="grid grid-cols-6 gap-6"> 같은 그리드 시스템 필요. 또는 public GridBorderBox와 같이사용*/}
            <div className="bg-white px-4 py-5 sm:p-6">
                <div className={[`col-span-${colSpenValue} sm:col-span-${colSmSpenValue}`, dirmode === "row" ? "flex" : ""].join(" ")}>
                    <label htmlFor={inputId} className={["block text-sm font-medium text-gray-700", dirmode === "row" ? `${rowWidth}` : ""].join(" ")}>
                        {label}
                    </label>
                    <input type="text" name={inputId} id={inputId} autoComplete={autoComplete} className="mt-1 block w-full focus:outline-none border-b-2" />
                </div>
            </div>
        </>
    );
}
const autoCompleteType = [
    "on",
    "off",
    "name",
    "honorific-prefix",
    "family-name",
    "given-name",
    "additional-name",
    "honorific-suffix",
    "nickname",
    "email",
    "username",
    "new-password",
    "current-password",
    "street-address",
    "country",
    "country-name",
    "sex",
    "url",
    "photo",
];
Object.freeze(autoCompleteType);
