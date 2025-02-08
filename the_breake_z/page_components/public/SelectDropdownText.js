/* next Module */
import { initAutoComplete } from "/scripts/client/autoComplete";
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputButton from "/page_components/Grid/GridInputButton";
import { LocalDataContext } from "/page_components/MyContext";
import { useEffect, useState, useRef } from "react";
import { getRandomInt, asyncInterval, devLog } from "/scripts/common";
import { copyToClipBoard, clickCopyToClipBoard, findLocalDataByName, findLocalDataByLocal } from "/scripts/client/client";

/**
 * @param {string} [label]
 * @param {string} [id]
 * @param {object[]} [object={NAME, TEXT}]
 * @returns
 */
export default function Layout(props) {
    const preRef = useRef();
    const label = props?.label || "label";
    const id = props?.id || "select-text-box";
    const object = props?.object || [];
    useEffect(() => {
        changeDropdownText();
    }, []);

    function changeDropdownText(e) {
        const name = e?.target.value || object[0].NAME;
        const element = findLocalDataByName(name, object);
        // devLog("changeDropdownText", name, element, preRef);
        preRef.current.innerText = element.TEXT;
    }

    return (
        <>
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <select
                    id={id}
                    onChange={changeDropdownText}
                    className={[
                        "mt-1 block w-full py-2 px-3 shadow-sm sm:text-sm",
                        "rounded-md border border-gray-300 bg-white, shadow-sm",
                        "focus:border-indigo-500 focus:outline-none focus:ring-indigo-500",
                    ].join(" ")}
                >
                    {object.map((item, idx) => {
                        return (
                            <option key={idx} value={item.NAME}>
                                {item.NAME}
                            </option>
                        );
                    })}
                </select>

                <div className="shadow rounded-md p-1 mb-1 bg-slate-300">
                    <pre ref={preRef} onClick={clickCopyToClipBoard} className="bg-white p-2 text-sm font-medium text-gray-700 overflow-x-auto scrollbar-remove">
                        {/* {element.TEXT} */}
                    </pre>
                </div>
            </div>
        </>
    );
}
