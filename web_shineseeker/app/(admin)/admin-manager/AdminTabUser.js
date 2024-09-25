"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import ListItemIndex from "/_custom/components/_common/ListItemIndex";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import GridInputSelectBox from "/_custom/components/_common/grid/GridInputSelectBox";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";
import Tooltip from "@/_custom/components/_common/Tooltip";

export default function Home() {
  const [userdata, setUserData] = useState([]);
  const [clickUserImage, setClickUserImage] = useState([]);
  const [skillList, setSkillList] = useState({skill: ["", "1", "2", "3"]});
  const [itemList, setItemList] = useState(["dsf", "sdfds", "SDfds"]);
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

    devLog("handleSubmitUser", apitype);
    updateDataWithFormInputs(e, apitype, "upload", addObject, true);
  };

  const clickUser = (e) => {
    const userid = e.target.dataset.name;
    const userIndex = e.target.dataset.index;
    const data = userdata?.[userIndex];
    if (data) {
      // setClickUserImage(userdata?.[userIndex]?.["imagePaths"]);
      // 1. 일반 input 값 채우기
      const updataFormInputList = document.querySelectorAll(".user-form form input");
      devLog("clickUser", e.target.dataset.name, data, clickUserImage);

      updataFormInputList.forEach((input) => {
        if (input.id.startsWith("user_img_") || input.id.startsWith("user_item_")) return; // 특수 input은 제외
        try {
          input.value = data[input.id];
        } catch (e) {
          console.error(input, e);
        }
      });
      // 2. 이미지 채우기
      setClickUserImage([data["user_img_0"], data["user_img_1"], data["user_img_2"], data["user_img_3"]]);
      // 3. 스킬(select) 채우기
      const selectElements = document.querySelectorAll(".user-form form select");
      selectElements.forEach((select) => {
        select.value = data[select.id];
      });
      // 4. 아이템 채우기
      setItemList([...data.items]);
    }
  };

  const addItem = (e) => {
    const item = document.getElementById("user_item_add").value;
    if (item) {
      setItemList([...itemList, item]);
    }
  };

  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response;
    if (fetchIndex++ == 0) response = await fetch("/api/select?apitype=user&getcount=1");
    else response = await fetch("/api/select?apitype=user");
    const newData = await response.json();
    if (newData?.data?.length) setUserData([...newData.data]);
    // console.log(`${fetchIndex} user admin page data : `, newData);
  }

  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 3 * 1000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full">
      <div className="w-1/5 flex flex-col mr-3 ">
        <h3 className="text-center font-bold text-2xl">유저리스트</h3>
        <div className="flex flex-wrap w-full row-gap-0 h-fit bg-slate-100">
          {Object.keys(userdata).map((key, index) => {
            if (userdata[key]["userid"]) {
              return (
                <Tooltip key={index} content={<span>이것은 테스트 툴팁입니다!</span>} css={"w-full"}>
                  <ListItemIndex index={index} label={userdata[key]["userid"]} onclick={clickUser} />
                </Tooltip>
              );
            }
          })}
        </div>
      </div>
      <div className="w-3/5 flex flex-col user-form">
        {/* <h3 className="text-center">유저리스트</h3> */}
        <form onSubmit={handleSubmitUser} className="grid grid-cols-12 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100 w-full" style={{minHeight: "400px"}} data-apitype="update_user">
          {makeInputList(userinputNames, skillList)}
          <div className="relative col-span-12 mt-4 flex gap-1">
            {[
              ["두상", clickUserImage?.[0] || false],
              ["전신", clickUserImage?.[1] || false],
              ["추가전신", clickUserImage?.[2] || false],
              ["마스코트", clickUserImage?.[3] || false],
            ].map((data, index) => (
              <div className="block w-1/4" key={index}>
                <label htmlFor={`user_img_${index}`} className="block text-sm font-medium text-gray-700 row">
                  {data[0]}
                </label>
                <FileDragAndDrop css={"mt-2 w-full col-span-4 h-[200px]"} id={`user_img_${index}`} type={"image/"} text={data[1] ? null : "Drag Or Click"} image={data[1]} objectFit={"fill"} />
              </div>
            ))}
          </div>
          <div className="relative col-span-12 mt-4 user-itemlist">
            <h3 className="text-center font-bold text-2xl">유저 아이템 리스트</h3>
            <div className="flex flex-wrap w-full row-gap-0 min-h-10 h-fit bg-slate-100">
              {itemList.map((item, index) => (
                <Tooltip key={index} content={<span>이것은 테스트 툴팁입니다!</span>} css={"w-1/6"}>
                  <GridInputText nolabel={true} readonly={true} default={item} id={`user_item_${index}`} type={"text"} css={"text-center border"} />
                </Tooltip>
              ))}
            </div>
          </div>
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
        <div className="flex flex-wrap w-full row-gap-0 min-h-10 h-fit bg-slate-100">
          <h3 className="text-center font-bold text-2xl mr-4">유저 아이템 추가 - 미완성</h3>
          <GridInputText nolabel={true} id={"user_item_add"} type={"text"} css={"text-center border"} />
          <GridInputButton label={"추가"} type={"button"} onclick={addItem} />
        </div>
      </div>
      <div className="w-1/5 flex"></div>
    </div>
  );
}
/**
 *
 * @param {*} inputNameObjects
 * @param {*} checkboxOptionObjects
 * @returns
 */
function makeInputList(inputNameObjects, checkboxOptionObjects = {}) {
  return (
    <React.Fragment>
      {inputNameObjects.map((obj, index) => (
        <React.Fragment key={index}>
          {obj?.header ? <h1 className="col-span-full font-bold text-2xl">{obj.header}</h1> : null}
          {obj?.inputType === "checkbox" ? (
            Object.keys(checkboxOptionObjects).length === 0 || !(obj?.class && checkboxOptionObjects[obj.class].length !== 0) ? (
              <GridInputSelectBox key={index} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} />
            ) : (
              <GridInputSelectBox key={index} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} options={checkboxOptionObjects[obj.class]} />
            )
          ) : obj?.inputType === "text" ? (
            <div key={index} className={`relative col-span-${obj.colSpan || 12}`}>
              <label htmlFor="usertab_second_word" className="block text-sm font-medium text-gray-700 ">
                {obj.label}
              </label>
              <p className="bg-gray-400 border-b mt-1 block w-full focus:outline-none rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">{obj.text}</p>
            </div>
          ) : (
            <GridInputText key={index} label={obj.label} id={obj.id} type={obj.type || "text"} colSpan={obj?.colSpan || 12} css="border-b" />
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

// ** id에 하이푼(-) 대신 언더바(_) 사용할 것 (sql 컬럼명과 동일하게)
const userinputNames = [
  {header: "일반 설정", label: "아이디", id: "userid", colSpan: 3},
  {label: "비밀번호", id: "userpw", colSpan: 3},
  {label: "첫번째 닉네임", id: "username1", colSpan: 3},
  {label: "두번째 닉네임", id: "username2", colSpan: 3},
  {label: "직업", id: "job", colSpan: 12},
  {label: "추가정보", id: "addinfo1", colSpan: 12},
  {label: "추가정보2", id: "addinfo2", colSpan: 12},
  {header: "탭 내용", label: "탭 기본정보", id: "usertab_baseinfo"},
  {label: "탭 상세정보", id: "usertab_detailinfo"},
  {label: "첫번째 탭 한마디", id: "usertab_first_word"},
  {label: "두번째 탭 한마디", id: "usertab_second_word"},
  {header: "스테이터스", label: "HP", id: "user_hp", type: "number", colSpan: 2},
  {label: "ATK", id: "user_atk", type: "number", colSpan: 2},
  {label: "DEF", id: "user_def", type: "number", colSpan: 2},
  {label: "WIS", id: "user_wis", type: "number", colSpan: 2},
  {label: "AGI", id: "user_agi", type: "number", colSpan: 2},
  {label: "LUK", id: "user_luk", type: "number", colSpan: 2},
  {header: "습득 스펠", label: "스킬1", id: "user_skill1", inputType: "checkbox", class: "skill", colSpan: 2},
  {label: "스킬2", id: "user_skill2", inputType: "checkbox", class: "skill", colSpan: 2},
  {label: "스킬3", id: "user_skill3", inputType: "checkbox", class: "skill", colSpan: 2},
  {label: "스킬4", id: "user_skill4", inputType: "checkbox", class: "skill", colSpan: 2},
  {label: "스킬5", id: "user_skill5", inputType: "checkbox", class: "skill", colSpan: 2},
  {header: "보유 재화", label: "금화", id: "user_money", type: "number", colSpan: 10},
  {label: "단위", id: "user_money", inputType: "text", text: "AKA", colSpan: 2},
];
