"use client";
import {useState} from "react";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";

export default function Home() {
  const tabList = ["계정추가", "다른거"];
  const [activeTab, setActiveTab] = useState(tabList[0]);

  const handleSubmitUser = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("apitype", "user");
    const inputs = e.target.querySelectorAll("input");

    inputs.forEach((inputNode) => {
      if (inputNode.type === "file" && inputNode?.files) {
        console.log("handleSubmitUser", inputNode, inputNode.files);
        Array.from(inputNode.files).forEach((file) => {
          formData.append("file", file);
        });
      } else {
        formData.append(inputNode.id, inputNode.value);
      }
    });
    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-4">
        {tabList.map((tab, index) => {
          return (
            <button key={index} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 border-gray-500"}`}>
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === tabList[0] && (
        <form onSubmit={handleSubmitUser} className="grid grid-cols-1 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100" style={{minHeight: "400px"}}>
          <GridInputText label={"ID"} id={"userid"} />
          <GridInputText label={"PASSWORD"} id={"userpw"} />
          <GridInputText label={"NICKNAME"} id={"username"} />
          <GridInputText label={"NICKNAME"} id={"username"} />
          <GridInputText label={"NICKNAME"} id={"username"} />
          <GridInputText label={"NICKNAME"} id={"username"} />
          <FileDragAndDrop css={"mt-2 w-full col-span-6"} />
          <GridInputButton label={"submit"} type="submit" />
        </form>
      )}
    </div>
  );
}
