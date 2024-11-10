import React from "react";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import GridInputTextArea from "/_custom/components/_common/grid/GridInputTextArea";
import GridInputSelectBox from "/_custom/components/_common/grid/GridInputSelectBox";

export default function makeInputList({inputNameObjects, checkboxOptionObjects = {}}) {
  return (
    <React.Fragment>
      {inputNameObjects.map((obj, index) => (
        <React.Fragment key={index}>
          {obj?.delimiter ? <div className="col-span-full" /> : null}
          {obj?.header ? <h1 className="col-span-full font-bold text-2xl">{obj.header}</h1> : null}
          {obj?.inputType === "checkbox" ? (
            obj?.checkOptions?.length || !(obj?.class && checkboxOptionObjects?.[obj.class]?.length) ? (
              <GridInputSelectBox key={index} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} onchange={obj?.onchange} options={obj?.checkOptions || []} />
            ) : (
              <GridInputSelectBox key={index} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} onchange={obj?.onchange} options={checkboxOptionObjects[obj.class]} />
            )
          ) : obj?.inputType === "textarea" ? (
            <GridInputTextArea key={index} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} css={"border-b" + (obj?.css || "")} maxHeight={250} />
          ) : obj?.inputType === "text" ? (
            <div key={index} className={`relative col-span-${obj.colSpan || 12}`}>
              <label htmlFor="usertab_second_word" className="block text-sm font-medium text-gray-700 ">
                {obj.label}
              </label>
              <p className="bg-gray-400 border-b mt-1 block w-full focus:outline-none rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">{obj.text}</p>
            </div>
          ) : obj?.type === "number" ? (
            <GridInputText key={index} nolabel={obj?.nolabel} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} css={"border-b" + (obj?.css || "")} numberMax={obj?.max} numberMin={obj?.min} />
          ) : (
            <GridInputText key={index} nolabel={obj?.nolabel} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} css={"border-b" + (obj?.css || "")} />
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
