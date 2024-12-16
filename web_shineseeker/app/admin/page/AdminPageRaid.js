"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import GridInputSelectBox from "@/_custom/components/_common/grid/GridInputSelectBox";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import NotificationModal from "@/_custom/components/NotificationModal";
import {getImageUrl} from "@/_custom/scripts/client";

const menuName = "battle";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [noti, setNoti] = useState(null);

  const optionText = ["O", "X"];
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
    updateDataWithFormInputs(e, apitype, "admin/upload-page", addObject, true, false); // 이미지 파일 없는경우에도 id값 포함해서 보내기 위해 설정
    setNoti("정보가 업데이트 되었습니다.");
  };

  const fillNode = () => {
    maindata.forEach((data) => {
      const element = document.querySelector(`#${data.id}`);
      if (element) element.value = data.value || null;
    });
  };

  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response;
    if (fetchIndex++ == 0) response = await fetch(`/api/select?apitype=page&getcount=1&pagename=${menuName}`);
    else response = await fetch(`/api/select?apitype=page&pagename=${menuName}`);
    const newData = await response.json();
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다(${fetchIndex}): `, newData);
      setMainData([...newData.data]);
    }
  }

  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
  }, []);
  // 데이터를 서버에서 가져오면 자동으로 채워주는 역할
  useEffect(() => {
    fillNode();
  }, [maindata]);

  return (
    <div className="flex w-full">
      <div className={`w-full flex flex-col ${menuName}-form`}>
        <form
          onSubmit={handleSubmitUser}
          data-apitype={`update_${menuName}`}
          className="grid grid-cols-12 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100 w-full"
          style={{minHeight: "400px"}}
        >
          <h1 className="mt-8 font-bold text-2xl col-span-12">레이드 페이지 관리</h1>
          <GridInputSelectBox label="패트롤 활성화 여부" id={"battle_active_status_patrol"} colSpan={6} options={optionText} />
          <GridInputSelectBox label="레이드 활성화 여부" id={"battle_active_status_raid"} colSpan={6} options={optionText} />
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
      </div>
      {noti && <NotificationModal message={noti} onClose={() => setNoti(null)} />}
    </div>
  );
}

const itemDefaultList = {
  item_option_type: ["성장재료", "이벤트", "우편", "스킬북"],
  item_option_addstat: ["HP", "ATK", "DEF", "WIS", "AGI", "LUK"],
  item_option_consumable: ["O", "X"],
  item_option_msg: ["X", "O"],
};
