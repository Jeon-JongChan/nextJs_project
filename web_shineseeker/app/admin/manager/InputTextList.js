/* next Module */
"use client";
import Script from "next/script";
import {useEffect} from "react";
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
  const nolabel = props?.nolabel || false;
  let inputId = props?.id || "input-text";
  let colSpan = props?.colSpan || 6;
  // let colSmSpenValue = props?.colSmSpan || 4;
  let dataName = props?.dataName || null;
  let type = props?.type || "text";
  let readonly = props?.readonly || false;
  let readonlyClass = readonly ? "bg-gray-200" : "";
  let css = props?.css || "";
  let defaultValue = props?.default || "";
  let deleteButton = props?.deleteButton || false;
  let deleteFunc = props?.deleteFunc || null;

  return (
    <>
      {/* <div className="grid grid-cols-6 gap-6"> 같은 그리드 시스템 필요. 또는 public GridBorderBox와 같이사용*/}
      {/* sm:col-span-${colSmSpenValue} 일단 제외 */}
      <div className={["relative grid", colSpanClass[colSpan]].join(" ")}>
        <input
          type={type}
          name={inputId}
          id={inputId}
          data-name={dataName}
          readOnly={readonly}
          defaultValue={defaultValue} // default 값
          className={[css, "mt-1 block w-full focus:outline-none rounded-md", "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500", readonlyClass].join(" ")}
        />
        {deleteButton && (
          <button onClick={deleteFunc} className="absolute inline-block h-full right-[5px]">
            x
          </button>
        )}
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
