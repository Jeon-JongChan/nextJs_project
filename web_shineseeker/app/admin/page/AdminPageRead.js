"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputTextArea from "/_custom/components/_common/grid/GridInputTextArea";

const menuName = "read";
export default function Home() {
  const [maindata, setMainData] = useState([]);
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
  };

  const fillNode = () => {
    const name = menuName; // e.target.dataset.name;
    const images = {};

    maindata.forEach((data) => {
      if (data.id.startsWith(`${name}_img`)) {
        let idx = data.id.split("_").pop();
        images[idx] = data.value;
      } else {
        const element = document.querySelector(`#${data.id}`);
        if (element) element.value = data.value;
      }
    });
    // setSavedImage(images);
    // if (Object.keys(images).length) setSlideList(Object.keys(images)); // 저장된 슬라이드 이미지가 있으면 개수 맞춰주기
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
    // devLog(fetchIndex);
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    // return () => clearInterval(intervalId);
  }, []);
  // 데이터를 서버에서 가져오면 자동으로 채워주는 역할
  useEffect(() => {
    fillNode();
  }, [maindata]);

  return (
    <div className="flex w-full">
      <div className={`w-full flex flex-col ${menuName}-form`}>
        <form onSubmit={handleSubmitUser} data-apitype={`update_${menuName}`} className="grid grid-cols-12 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100 w-full" style={{minHeight: "400px"}}>
          <h1 className="mt-8 font-bold text-2xl col-span-12">필독 탭 내용 관리</h1>
          {[{label: "커뮤니티"}, {label: "로그작성기준"}, {label: "러닝주의사항"}, {label: "금지사항"}, {label: "하차 및 제명"}].map((data, index) => (
            <GridInputTextArea label={data.label} id={`${menuName}_tab_${index}`} type={"text"} colSpan={12} default={`탭 ${index + 1}의 내용입니다.`} css="border-b" key={index} />
          ))}
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
      </div>
    </div>
  );
}
