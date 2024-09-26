import {useEffect, useRef} from "react";
/**
 * @param {string} [label=Input Text] - 라벨에 출력할 Inner Text
 * @param {string} [id] - input id
 * @param {string} [css] - textarea에 들어갈 tailwind css
 * @param {string} [default] - default text
 * @param {float} [maxHeight] - 자동증가가 될 최대 높이
 */
export default function Component(props) {
  const textAreaRef = useRef(null);
  let label = props?.label || "상용구 내용";
  let id = props?.id || "";
  let css = props?.css || "";
  let colSpan = props?.colSpan || 6;
  let defaultValue = props?.default || null;
  let maxHeight = props?.maxHeight || null;

  let initHeight = 100.0;

  useEffect(() => {
    maxHeight = window.innerHeight / 2.5;
    textAreaRef.current.addEventListener("input", handleResizeHeight);
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = initHeight.toString() + "px";
  }, []);

  function handleResizeHeight() {
    if (maxHeight) {
      if (textAreaRef.current.scrollHeight > maxHeight) {
        textAreaRef.current.style.height = maxHeight + "px";
        return;
      }
    }
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  }
  return (
    <>
      <div className={["relative", colSpanClass[colSpan]].join(" ")}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          ref={textAreaRef}
          // onInput={handleResizeHeight}
          id={id}
          defaultValue={defaultValue}
          rows={4}
          className={[
            css,
            "block focus:outline-none rounded-md",
            "mt-1 w-full h-full px-2 py-1",
            "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
            "overflow-x-auto scrollbar-remove",
          ].join(" ")}
        />
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
