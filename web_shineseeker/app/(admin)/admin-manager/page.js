"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import {useState, useEffect} from "react";
import AddUser from "./AddUser";
import ListItem from "/_custom/components/_common/ListItem";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";
import Tooltip from "@/_custom/components/_common/Tooltip";

export default function Home() {
  const tabList = ["계정추가", "다른거"];
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [userdata, setUserData] = useState({});

  const handleSubmitUser = (e) => {
    e.preventDefault();
    const apitype = e.target.dataset.apitype;
    console.log("handleSubmitUser", apitype);
    updateDataWithFormInputs(e, apitype, "upload");
  };

  const clickUser = (e) => {
    const userid = e.target.dataset.name;
    const data = userdata?.[userid];
    if (data) {
      console.log("clickUser", e.target.dataset.name, data);
      const updataFormInputList = document.querySelectorAll(".user form input");

      updataFormInputList.forEach((input) => {
        if (input.type === "file") return;
        try {
          if (input.id === "userid") input.value = userid;
          else input.value = data[input.id];
        } catch (e) {
          console.error(input, e);
        }
      });
    }
  };

  useEffect(() => {
    let fetchIndex = 0;
    // 데이터를 주기적으로 가져오기 위한 함수
    async function fetchData() {
      let response;
      if (fetchIndex++ == 0) response = await fetch("/api/select?apitype=user&getcount=1");
      else response = await fetch("/api/select?apitype=user");
      const newData = await response.json();
      if (newData?.data) setUserData(newData?.data);

      console.log(`${fetchIndex} user admin page data : `, userdata);
    }

    // 5초마다 데이터를 가져옴
    const intervalId = setInterval(fetchData, 5000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, [userdata]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center mb-4 w-full">
        {tabList.map((tab, index) => {
          return (
            <button key={index} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 border-gray-500"}`}>
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === tabList[0] && (
        <div className="flex w-full">
          <div className="w-1/2 flex user">
            <form
              onSubmit={handleSubmitUser}
              className="grid grid-cols-1 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100 w-full"
              style={{minHeight: "400px"}}
              data-apitype="update_user"
            >
              {makeInputList(userinputNames)}
              <label htmlFor="drag-drop-img" className="block text-sm font-medium text-gray-700 row">
                캐릭터 프로필 이미지
              </label>
              <FileDragAndDrop css={"mt-2 w-full col-span-6"} type={"image/"} text={"이미지를 끌어오거나 클릭하세요!"} />
              <GridInputButton label={"submit"} type="submit" />
            </form>
          </div>
          <div className="w-1/2 flex">
            <div className="flex flex-col">
              {Object.keys(userdata).map((key, index) => {
                if (key !== "updated")
                  return (
                    <Tooltip key={index} content={<span>이것은 테스트 툴팁입니다!</span>}>
                      <ListItem key={index} label={key} count={userdata[key]} onclick={clickUser} />
                    </Tooltip>
                  );
              })}
            </div>
          </div>
        </div>
      )}
      {/* {activeTab === tabList[1] && <AddUser apitype={"test"} />} */}
    </div>
  );
}

function makeInputList(inputNameObjects) {
  /*
  const handleSubmitUser = (e) => {
    e.preventDefault();
    console.log("handleSubmitUser", apitype, apiurl);
    updateDataWithFormInputs(e, apitype, apiurl);
  };
  */
  return (
    <>
      {inputNameObjects.map((name, index) => (
        <GridInputText key={index} label={name.label} id={name.id} type={name.type || "text"} />
      ))}
    </>
  );
}

const userinputNames = [
  {label: "ID", id: "userid"},
  {label: "PASSWORD", id: "userpw"},
  {label: "NICKNAME", id: "username"},
  {label: "프로필", id: "profill"},
  {label: "직업", id: "job"},
  {label: "레벨", id: "level"},
  {label: "스탯", id: "stat"},
  {label: "스킬", id: "skill"},
  {label: "돈", id: "money", type: "number"},
];
