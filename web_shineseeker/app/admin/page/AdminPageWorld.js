"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputTextArea from "/_custom/components/_common/grid/GridInputTextArea";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";

const menuName = "world";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [savedImage, setSavedImage] = useState({});
  const [skillList, setSkillList] = useState({});
  let fetchIndex = 0;

  /* 입력 Input 조절에 쓰일 state */
  const [slideList, setSlideList] = useState([]);

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

  const manageSlide = (status) => {
    if (status) setSlideList([...slideList, ...Array(status).map((_, index) => slideList.length + index)]);
    else setSlideList(slideList.slice(0, slideList.length - 1));
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
    setSavedImage(images);
    if (Object.keys(images).length) setSlideList(Object.keys(images)); // 저장된 슬라이드 이미지가 있으면 개수 맞춰주기
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
    console.log(fetchIndex);
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
          <h1 className="mt-8 font-bold text-2xl col-span-12">세계관 페이지 슬라이드 관리</h1>
          {slideList.map((_, index) => (
            <FileDragAndDrop key={index} css={"mt-2 w-full col-span-2 h-[500px]"} id={`world_img_slide_${index}`} type={"image/"} text={savedImage?.[index] ? null : "Drag Or Click"} image={savedImage?.[index]} objectFit={"fill"} />
          ))}
          <div className="col-span-full" />
          <div className="col-span-8" />
          <div className="col-span-4 flex justify-end">
            <GridInputButton colSpan={4} label={"슬라이드 삭제"} type="button" buttonColor={"red"} onclick={() => manageSlide(0)} css="w-1/2" />
            <GridInputButton colSpan={4} label={"슬라이드 추가 생성"} type="button" onclick={() => manageSlide(1)} css="w-1/2" />
          </div>
          <h1 className="mt-8 font-bold text-2xl col-span-12">세계관 탭 내용 관리</h1>
          {[{label: "세계"}, {label: "샤인시커"}, {label: "포텐셜"}, {label: "시커하이브"}, {label: "사도"}].map((data, index) => (
            <GridInputTextArea label={data.label} id={`world_tab_${index}`} type={"text"} colSpan={12} default={`탭 ${index + 1}의 내용입니다.`} css="border-b" key={index} />
          ))}
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
      </div>
    </div>
  );
}
