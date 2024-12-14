"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import ListItemIndex from "/_custom/components/_common/ListItemIndex";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import MakeInputList from "./MakeInputList";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";
import Tooltip from "@/_custom/components/_common/TooltipFixed";
import NotificationModal from "@/_custom/components/NotificationModal";
import {getImageUrl} from "@/_custom/scripts/client";

const menuName = "skill";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [clickImage, setClickImage] = useState([]);
  const [skillList, setSkillList] = useState({});
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
    devLog("clickListItem", skillList, maindata);
    if (data) {
      // 1. 일반 input 값 채우기
      const updataFormInputList = document.querySelectorAll(`.${menuName}-form form input`);
      devLog("clickUser", name, data, clickImage);

      updataFormInputList.forEach((input) => {
        if (input.id.startsWith(`${menuName}_img_`) || input.id.startsWith(`${menuName}_option_`)) return; // 특수 input은 제외
        try {
          input.value = data[input.id];
        } catch (e) {
          console.error(input, e);
        }
      });
      // 2. 이미지 채우기
      setClickImage([data[`${menuName}_img_0`] || "init", data[`${menuName}_img_1`] || "init"]);
      // 3. 사용효과(select) 채우기
      const selectElements = document.querySelectorAll(`.${menuName}-form form select`);
      selectElements.forEach((select) => {
        select.value = data[select.id];
      });
      // textarea 채우기
      const textareaElements = document.querySelectorAll(`.${menuName}-form form textarea`);
      textareaElements.forEach((textarea) => {
        textarea.value = data[textarea.id];
      });
    }
  };

  // fileDragAndDrop에서 이미지를 바꿀경우 상위 stat 수정
  const imgInitFn = (event) => {
    const id = event.target.id;
    const files = Array.from(event.target.files);
    devLog("imgInitFn : ", id);
    // id 끝자리에서 index를 추출하여 해당 index의 이미지를 초기화
    if (!id || files.length == 0) return;
    const index = id.slice(-1);
    const clickImageCopy = [...clickImage];
    clickImageCopy[index] = null;
    setClickImage(clickImageCopy);
    devLog("imgInitFn : ", clickImageCopy);
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
    console.info("ADMIN DATA MANAGEMENT PAGE : 스킬 항목 선택되었습니다.");
    const response = await fetch("/api/select?apitype=skill_option&getcount=1");
    const newData = await response.json();
    if (newData?.data?.length) {
      // 스킬 상세정보를 input과 select에 넣기
      const skillList = {};
      for (const key of Object.keys(newData.data[0])) {
        if (key.startsWith("updated")) continue;
        document.querySelector(`#${key}`).value = newData.data[0][key]; // input에 기본값 넣기
        let id = key.replace("_option", "");
        skillList[id] = newData.data[0][key].split(",");
      }
      skillList.skill_operator_option = skillDefaultList.skill_operator_option;
      setSkillList({...skillList});
    }
    devLog("essential data skill option: ", newData);
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
    fetchEssentialData();
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 1000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full">
      <div className="w-1/5 flex flex-col mr-3 ">
        <h3 className="text-center font-bold text-2xl">스킬리스트</h3>
        <div className="flex flex-wrap w-full row-gap-0 h-fit bg-slate-100 max-h-screen overflow-y-auto">
          {Object.keys(maindata).map((key, index) => {
            if (maindata[key]["skill_name"]) {
              return (
                <Tooltip key={index} content={<span>{maindata[key]["skill_desc"]}</span>} css={"w-full"}>
                  <ListItemIndex label={maindata[key]["skill_name"]} index={index} onclick={clickListItem} deleteButton={true} deleteFunc={deleteTarget} alignDir={"left"} />
                </Tooltip>
              );
            }
          })}
        </div>
      </div>
      <div className={`w-4/5 flex flex-col ${menuName}-form`}>
        {/* prettier-ignore */}
        <form onSubmit={handleSubmitUser} data-apitype={`update_${menuName}`} className="grid grid-cols-12 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100 w-full" style={{minHeight: "400px"}}>
          <div className="relative col-span-12 mt-4 flex gap-1">
            {[
              ["스킬 아이콘", clickImage?.[0] || false],
              ["이펙트 이미지", clickImage?.[1] || false],
            ].map((data, index) =>
              //prettier-ignore
              <div className="block w-1/4" key={index}>
                <label htmlFor="skill_icon" className="block text-2xl font-bold">{data[0]}</label>
                <FileDragAndDrop css={"mt-2 w-full col-span-4 h-[200px]"} id={`skill_img_${index}`} type={"image/"} text={data[1] ? null : "Drag Or Click"} image={getImageUrl(data[1])} objectFit={"fill"} extFunc={imgInitFn}/>
              </div>
            )}
          </div>
          <MakeInputList inputNameObjects={inputNames} checkboxOptionObjects={ Object.keys(skillList).length ? skillList : skillDefaultList} />
          <h1 className="mt-8 col-span-full font-bold text-2xl">스킬 사용효과 리스트 입력칸 ( 구분자 &apos;,&apos; 로 해주세요 )</h1>
          <GridInputText label={"스킬 유형"} id={"skill_option_type"} type={"text"} colSpan={12} default={skillDefaultList.skill_type.join(',') } css="border-b" />
          <GridInputText label={"스킬 범위"} id={"skill_option_range"} type={"text"} colSpan={12} default={skillDefaultList.skill_range.join(',')} css="border-b" />
          <GridInputText label={"위력 능력치"} id={"skill_option_stat"} type={"text"} colSpan={12} default={skillDefaultList.skill_stat.join(',')} css="border-b" />
          <GridInputText label={"스킬소비항목"} id={"skill_option_cost"} type={"text"} colSpan={12} default={skillDefaultList.skill_cost_stat.join(',')} css="border-b" />
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
      </div>
      {noti && <NotificationModal message={noti} onClose={() => setNoti(null)} />}
    </div>
  );
}

const skillDefaultList = {
  skill_type: ["공격", "방어", "회복", "정지", "조정"],
  skill_range: ["자신", "아군", "적", "전체"],
  skill_operator_option: ["곱", "합", "잔여곱"],
  skill_stat: ["HP", "ATK", "DEF", "WIS", "AGI", "LUK"],
  skill_cost_stat: ["HP", "ATK", "DEF", "WIS", "AGI", "LUK"],
};
// ** id에 하이푼(-) 대신 언더바(_) 사용할 것 (sql 컬럼명과 동일하게)
const inputNames = [
  {label: "이펙트 이미지 On / Off", id: "skill_effect_usage", inputType: "checkbox", class: "skill", colSpan: 3, checkOptions: ["", "ON", "OFF"]},
  {header: "일반 설정", label: "스킬이름", id: "skill_name", colSpan: 6},
  {label: "설명", id: "skill_desc", inputType: "textarea", colSpan: 12},
  {header: "사용효과", label: "유형", id: "skill_type", inputType: "checkbox", class: "skill_type", colSpan: 2},
  {label: "범위", id: "skill_range", inputType: "checkbox", class: "skill_range", colSpan: 2},
  {label: "위력능력치", id: "skill_stat", inputType: "checkbox", class: "skill_stat", colSpan: 2},
  {label: "적용비율(%)", id: "skill_rate", type: "number", class: "skill", css: " h-[36px]", colSpan: 2},
  {label: "스킬소비연산", id: "skill_operator", inputType: "checkbox", class: "skill_operator_option", colSpan: 1},
  {label: "스킬소비항목", id: "skill_cost_stat", inputType: "checkbox", class: "skill_stat", colSpan: 1},
  {label: "소비계수", id: "skill_cost", type: "number", css: " h-[36px]", colSpan: 2},
  {label: "조정 능력치 (조정시 사용됨)", id: "skill_control_cost", inputType: "checkbox", class: "skill_stat", colSpan: 3},
  {label: "조정 능력 계수", id: "skill_control_rate", class: "skill", css: " h-[36px]", colSpan: 2},
  {label: "랜덤 최소 계수", id: "skill_min", class: "skill", css: " h-[36px]", colSpan: 2},
  {label: "랜덤 최대 계수", id: "skill_max", class: "skill", css: " h-[36px]", colSpan: 2},
];
