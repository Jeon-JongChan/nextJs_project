/**
 *
 * @param {string} [label] - 메인 텍스트
 * @param {string} [css] - 추가 tailwind css
 * @param {int} [count] - 텍스트 옆에 숫자 출력
 * @param {Function} [onclick] - 텍스트 옆에 숫자 출력
 * @returns
 */
export default function Component(props) {
  // autoComplete("i-local");
  let label = props?.label || "Cover photo";
  let count = props?.count || 0;
  let css = props?.css || "";
  let onclick = props?.onclick || null;
  let index = props?.index || 0;
  let deleteButton = props?.deleteButton || false;
  let deleteFunc = props?.deleteFunc || null;
  let alignDir = props?.alignDir || "center";

  let classText = `relative shadow rounded-md max-h-20 text-${alignDir} text-sm sm:text-xs col-span-1`;

  return (
    <>
      {/* <div data-name={label} className="shadow rounded-md max-h-20 p-2 text-center text-sm sm:text-xs col-span-1"> */}
      <div data-name={label} className={[css, classText].join(" ")}>
        <span className="inline-block h-full p-2" onClick={onclick} data-name={label} data-index={index}>
          {label} {count > 0 ? <span className="text-sm font-bold">({count})</span> : ""}
        </span>
        {deleteButton && (
          <button onClick={deleteFunc} className="absolute inline-block h-full right-[5px]">
            x
          </button>
        )}
      </div>
    </>
  );
}
