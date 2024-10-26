/**
 *
 * @param {string} [label]
 * @param {string} [id] select에 들어갈 id
 * @param {string} [css] select에 들어갈 tailwind css
 * @param {string} [name] select에 들어갈 name
 * @param {Array} [options] select에 하위에 들어갈 문자열 배열
 * @param {Function} [onchange] select에 들어갈 onchange
 * @returns
 */
export default function Component(props) {
  let label = props?.label || null;
  let nolabel = props?.nolabel || false;
  let id = props?.id || "grid-input-select-box";
  let name = props?.name || "grid-input-select-box";
  let onchange = props?.onchange || null;
  let colSpan = props?.colSpan || 1;
  let options = props?.options || ["United States", "Canada", "Mexico"];
  let css = props?.css || "";
  return (
    <>
      {/* <div className="grid grid-cols-6 gap-6"> 같은 그리드 시스템 필요. 또는 public GridBorderBox와 같이사용*/}
      <div className={["", colSpanClass[colSpan]].join(" ")}>
        {!nolabel || label ? (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        ) : null}
        <select
          id={id}
          name={name}
          onChange={onchange}
          className={[css, "mt-1 block w-full py-2 px-3 shadow-sm sm:text-sm", "rounded-md border border-gray-300 bg-white, shadow-sm", "focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"].join(" ")}
        >
          {options.map((option, idx) => {
            return (
              <option key={idx} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}
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
