/* next Module */
import Script from "next/script";
// * react
/**
 *
 * @param {string} [label=Input Text] - 라벨에 출력할 Inner Text
 * @param {string} [smallLabel] - 라벨 옆에 주의사항같은걸 적고싶을 때 사용
 * @param {string} [id=input-text] - input tag에 들어갈 ID (name 속성에도 들어감)
 * @param {string} [css] - input에 들어갈 tailwind css
 * @param {string} [autoComplete=on] - input 자동완성 옵션
 * @param {int} [colSpan=6] - input 넓이(Grid Column 기준)
 * @param {string} [type] - input type
 * @param {string} [readonly] - input readonly active (true/false)
 * @param {string} [default=""] - Input default 값
 * @param {string} [dirmode="col"] - 입력 라벨을 왼쪽으로 두고 싶을 경우 row
 * @param {string} [rowWidth="w-2/5"] - 입력 라벨을 왼쪽일경우 넓이 지정 (class명)
 */
//  @param {int} [colSmSpan=4] - 최소 width(640px) 기준 input 넓이(Grid Column 기준)
export default function Component(props) {
  let label = props?.label || null;
  const nolabel = props?.nolabel || false;
  let smallLabel = props?.smallLabel || "";
  let inputId = props?.id || "input-text";
  let colSpan = props?.colSpan || 6;
  let dirmode = props?.dirmode || "col";
  let rowWidth = props?.rowWidth || "w-2/5";
  let dataName = props?.dataName || null;
  let buttonWidth = props?.buttonWidth || "w-1/2";
  let css = props?.css || "";

  return (
    <>
      {/* <div className="grid grid-cols-6 gap-6"> 같은 그리드 시스템 필요. 또는 public GridBorderBox와 같이사용*/}
      {/*prettier-ignore*/}
      <div className={["relative", colSpanClass[colSpan], dirmode === "row" ? "flex" : "", css].join(" ")}>
        {!nolabel || label ? (
          <label htmlFor={inputId} className={["block text-sm font-medium text-gray-700", dirmode === "row" ? `${rowWidth}` : ""].join(" ")}>
            {label} {smallLabel === "" ? "" : <span className="text-xs text-red-300">{smallLabel}</span>}
          </label>
        ) : null}
        <div className="relative w-full h-[36px] flex items-end justify-start p-0 m-0">
          <button className={"text-white rounded-md cursor-pointer bg-green-400 px-[2px] p-1 text-sm h-[34px] "+buttonWidth} onClick={() => document.querySelector(`#${inputId}`).click()}>
            파일 선택
          </button>
          <div className="relative overflow-hidden w-full min-w-32 h-full flex items-center justify-start pl-2">
            <span className="absolute text-nowrap " id={`${inputId}_span`}>선택된 파일 없음</span>
          </div>
          <input
            id={`${inputId}`} name={inputId} type="file" style={{display: "none"}} data-name={dataName}
            onChange={(e) => {
              const fileName = e.target.files.length > 0 ? e.target.files[0].name : "선택된 파일 없음";
              const fileNameSpan = document.querySelector(`${inputId}_span`);
              fileNameSpan.textContent = fileName;

              const textWidth = fileNameSpan.scrollWidth;
              if (textWidth > 150) fileNameSpan.style.animation = `scrollText ${textWidth / 50}s linear infinite`;
              else fileNameSpan.style.animation = "";
            }}
          />
        </div>
        <style jsx>{`
          @keyframes scrollText {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%);}
          }
        `}</style>
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
