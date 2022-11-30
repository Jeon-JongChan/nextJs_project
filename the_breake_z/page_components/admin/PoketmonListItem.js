/**
 *
 * @param {string} [label] - 메인 텍스트
 * @param {int} [count] - 텍스트 옆에 숫자 출력
 * @returns
 */
export default function Component(props) {
    // autoComplete("i-local");
    let label = props?.label || "Cover photo";
    let count = props?.count || "file-input";
    return (
        <>
            <div data-name={label} className="shadow rounded-md col-span-1 max-h-10 p-2 text-center">
                <span>
                    {label} {count > 0 ? <span className="text-sm font-bold">({count})</span> : ""}
                </span>
            </div>
        </>
    );
}
