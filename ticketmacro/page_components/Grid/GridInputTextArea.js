import { useEffect, useRef } from "react";
/**
 * @param {string} [label=Input Text] - 라벨에 출력할 Inner Text
 * @param {string} [id] - input id
 * @param {string} [css] - textarea에 들어갈 tailwind css
 * @param {string} [default] - default text
 * @param {float} [maxHeight] - 자동증가가 될 최대 높이
 */
export default function Component(props) {
    const textAreaRef = useRef(null);
    let label = props?.label || "Input Text";
    let id = props?.id || "";
    let defaultValue = props?.default || null;
    let css = props?.css || "";
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
            <div className="relative col-span-6">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    상용구 내용
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
