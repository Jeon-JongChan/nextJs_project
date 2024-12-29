/* next Module */
import Script from "next/script";
// * react
/**
 *
 * @param {string} [label=Input Text] - button 출력할 Inner Text
 * @param {string} [type] - 라벨에 출력할 Inner Text
 * @param {string} [buttonColor] - 버튼 색상. blue | red
 * @param {int} [colSpan=6] - input 넓이(Grid Column 기준)
 * @param {Function} [onclick] - 버튼 클릭시 실행할 callback 메소드
 */
export default function Component(props) {
  let label = props?.label || "Save";
  let colSpan = props?.colSpan || 6;
  let type = props?.type || "submit";
  let onclick = props?.onclick || null;
  let buttonColor = props?.buttonColor || "blue";
  let css = props?.css || "";
  let buttonCss = props?.buttonCss || "";
  let disable = props?.disable || false;
  return (
    <>
      {/* <div className="grid grid-cols-6 gap-6"> 같은 그리드 시스템 필요. 또는 public GridBorderBox와 같이사용*/}
      <div className={["px-1 py-1 text-right", colSpanClass[colSpan], css].join(" ")}>
        <button
          type={type}
          className={[
            "w-full inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            buttonColorClass[buttonColor],
            hoverColorClass[buttonColor],
            buttonCss,
          ].join(" ")}
          onClick={onclick ? onclick : () => null}
          disabled={disable ? true : false}
        >
          {label}
        </button>
      </div>
    </>
  );
}
/**
 * 어이가 없게도 동적으로 tailwind 사용시 자동제거로 인해 미리 객체로 선언해서 col span에 따라 동적으로 클래스 네임 통째로 할당...
 */
const colSpanClass = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};
const buttonColorClass = {
  blue: "bg-indigo-600",
  red: "bg-red-600",
  zinc: "bg-zinc-400",
};
const hoverColorClass = {
  blue: "hover:bg-indigo-700",
  red: "hover:bg-red-700",
  zinc: "hover:bg-zinc-700",
};
