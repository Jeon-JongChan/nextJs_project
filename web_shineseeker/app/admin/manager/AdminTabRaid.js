"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import ListItemIndex from "/_custom/components/_common/ListItemIndex";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import MakeInputList from "./MakeInputList";
import Tooltip from "@/_custom/components/_common/TooltipFixed";
import Autocomplete from "@/_custom/components/_common/Autocomplete";
import NotificationModal from "@/_custom/components/NotificationModal";
import {getImageUrl} from "@/_custom/scripts/client";

const menuName = "menu";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [monster, setMonster] = useState(null);
  const [noti, setNoti] = useState(null);
  let fetchIndex = 0;

  const handleSubmitUser = (e) => {
    e.preventDefault();
    const apitype = e.target.dataset.apitype;
    const addObject = {};

    // 각 select의 id와 선택된 value를 가져와 result 객체에 저장
    const selectElements = e.target.querySelectorAll("select");
    selectElements.forEach((select) => {
      addObject[select.id] = select.value; // id: value 형태로 저장
    });
    // textarea의 id와 value를 가져와 result 객체에 저장
    const textareaElements = e.target.querySelectorAll("textarea");
    textareaElements.forEach((textarea) => {
      addObject[textarea.id] = textarea.value; // id: value 형태로 저장
    });

    devLog("handleSubmitUser", apitype);
    updateDataWithFormInputs(e, apitype, "admin/upload", addObject, true);
    setNoti("정보가 업데이트 되었습니다.");
  };

  const clickListItem = (e) => {
    const name = e.target.dataset.name;
    const listIndex = e.target.dataset.index;
    const data = maindata?.[listIndex];
    devLog("clickListItem", patrolOptionList, maindata);
    if (data) {
      // 1. 일반 input 값 채우기
      const updataFormInputList = document.querySelectorAll(`.${menuName}-form form input`);
      devLog("click", name, data, clickImage);

      updataFormInputList.forEach((input) => {
        if (input.id.startsWith(`${menuName}_img`) || input.id.startsWith(`${menuName}_ret_img`) || input.id.startsWith(`${menuName}_select`)) return; // 특수 input은 제외
        try {
          input.value = data[input.id];
        } catch (e) {
          console.error(input, e);
        }
      });
      setInputOptionList(data.choices ? Object.keys(data.choices) : [0, 1, 2]);

      // 3. 사용효과(select) 채우기
      const selectElements = document.querySelectorAll(`.${menuName}-form form select`);
      selectElements.forEach((select) => {
        select.value = data[select.id];
      });
      // 4.textarea 채우기
      const textareaElements = document.querySelectorAll(`.${menuName}-form form textarea`);
      textareaElements.forEach((textarea) => {
        textarea.value = data[textarea.id];
      });
    }
  };

  const deleteTarget = (e) => {
    e.preventDefault();
    const spanElement = e.target.parentElement.querySelector("span[data-name]");
    const target = spanElement.dataset.name;
    devLog(`delete ** ${menuName} **`, target);
    const formData = new FormData();
    formData.append("apitype", "delete_" + menuName);
    formData.append(`${menuName}`, target);
    try {
      fetch("/api/admin/delete", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setMainData((prevData) => prevData.filter((prev) => prev[`${menuName}_name`] !== target));
          devLog(`delete-${menuName} success : `, data, target, userdata);
        })
        .catch((error) => console.error("Error:", error));
    } catch (e) {
      console.error(`delete-${menuName} error : `, e.message);
    }
  };

  async function fetchEssentialData() {
    console.info("ADMIN DATA MANAGEMENT PAGE : 패트롤 항목 선택되었습니다.");
    const response = await fetch("/api/select?apitype=monster&getcount=1");
    const newData = await response.json();
    if (newData?.data?.length) setMonster(...newData?.data);
    devLog("essential data monster: ", newData);
  }

  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response;
    if (fetchIndex++ == 0) response = await fetch(`/api/select?apitype=${menuName}&getcount=1`);
    else response = await fetch(`/api/select?apitype=${menuName}`);
    const newData = await response.json();
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다(${fetchIndex}): `, newData);
      setMainData([...newData.data]);
    }
  }

  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    //fetchEssentialData();
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 1000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full">
      <div className="w-1/5 flex flex-col mr-3 ">
        <h3 className="text-center font-bold text-2xl">레이드 리스트</h3>
        <div className="flex flex-wrap w-full row-gap-0 h-fit bg-slate-100 max-h-screen overflow-y-auto">
          {Object.keys(maindata).map((key, index) => {
            if (maindata[key]["patrol_name"]) {
              return (
                <Tooltip key={index} content={<span>{maindata[key]["patrol_desc"]}</span>} css={"w-full"}>
                  <ListItemIndex label={maindata[key]["patrol_name"]} index={index} onclick={clickListItem} deleteButton={true} deleteFunc={deleteTarget} alignDir={"left"} />
                </Tooltip>
              );
            }
          })}
        </div>
      </div>
      <div className={`w-4/5 flex flex-col ${menuName}-form`}>
        <form
          onSubmit={handleSubmitUser}
          data-apitype={`update_${menuName}`}
          className="grid grid-cols-12 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100 w-full"
          style={{minHeight: "400px"}}
        >
          <MakeInputList inputNameObjects={inputNames} />
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
      </div>
      {monster && <Autocomplete id={"#monster_name"} data={monster} autokey={"monster_name"} />}
      {noti && <NotificationModal message={noti} onClose={() => setNoti(null)} />}
    </div>
  );
}

const inputNames = [
  {header: "레이드 목록 작성", label: "레이드이름", id: "raid_name", colSpan: 6, css: " h-[36px]"},
  {label: "보스몬스터", id: "monster_name", colSpan: 6, css: " h-[36px]"},
];
