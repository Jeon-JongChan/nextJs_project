"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect, useCallback} from "react";
import {devLog} from "@/_custom/scripts/common";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputTextArea from "/_custom/components/_common/grid/GridInputTextArea";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import ListItemIndex from "/_custom/components/_common/ListItemIndex";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";
import Tooltip from "@/_custom/components/_common/TooltipFixed";
import InputTextList from "../InputTextList";
import Autocomplete from "@/_custom/components/_common/Autocomplete";
import NotificationModal from "@/_custom/components/NotificationModal";
import {getImageUrl} from "@/_custom/scripts/client";

const menuName = "market";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [savedImage, setSavedImage] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [allItems, setAllItems] = useState([]);
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
    updateDataWithFormInputs(e, apitype, "admin/upload-page", addObject, true, false, ["market_item_add"]); // 이미지 파일 없는경우에도 id값 포함해서 보내기 위해 설정
    setNoti("정보가 업데이트 되었습니다.");
  };

  const addItem = (e) => {
    e.preventDefault();
    const item = document.querySelector("#market_item_add").value;
    devLog("addItem", item);
    if (item) {
      setItemList([...itemList, item]);
    }
  };

  const clickItem = (e) => {
    e.preventDefault();
    const item = e.target.dataset.name;
    devLog("clickItem", item);
    document.querySelector("#market_item_add").value = item;
  };

  const deleteItem = (e) => {
    const inputElement = e.target.parentElement.querySelector("input");
    const item = inputElement.value;

    // 삭제할 아이템의 인덱스를 찾고 복사본에 반영
    const itemIndex = itemList.indexOf(item);
    if (itemIndex > -1) {
      const itemListCopy = [...itemList];
      itemListCopy.splice(itemIndex, 1); // 아이템 삭제
      setItemList(itemListCopy);
    }
    e.preventDefault();
  };

  const fillNode = () => {
    const name = menuName; // e.target.dataset.name;
    const images = {};

    maindata.forEach((data) => {
      if (data.id.startsWith(`${name}_img`)) {
        setSavedImage(data.value);
      } else if (data.id === "market_item") {
        setItemList(JSON.parse(data.value));
      } else {
        const element = document.querySelector(`#${data.id}`);
        if (element) element.value = data.value;
      }
    });
    // setSavedImage(images);
    // if (Object.keys(images).length) setSlideList(Object.keys(images)); // 저장된 슬라이드 이미지가 있으면 개수 맞춰주기
  };

  // fileDragAndDrop에서 이미지를 바꿀경우 상위 stat 수정
  const imgInitFn = (event) => {
    const id = event.target.id;
    const files = Array.from(event.target.files);
    devLog("imgInitFn : ", id);
    // id 끝자리에서 index를 추출하여 해당 index의 이미지를 초기화
    if (!id || files.length == 0) return;
    const index = id.slice(-1);
    const images = URL.createObjectURL(files[0]);
    setSavedImage(images);
  };

  const fetchEssentialData = useCallback(async () => {
    console.info("ADMIN DATA MANAGEMENT PAGE : 유저관리 항목 선택되었습니다.");
    // 스킬 데이터 가져오기
    // 아이템 전부 가져오기
    const response3 = await fetch("/api/select?apitype=item&getcount=1");
    const newData3 = await response3.json();

    if (newData3?.data) setAllItems([...newData3.data]);

    devLog("essential data fetch user : ", newData3);
  });

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
    fetchEssentialData();
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
          <GridInputText label={"상점 주인 이름"} id={"market_npc_name"} type={"text"} colSpan={12} css="border-b" />
          <h1 className="mt-8 font-bold text-2xl col-span-12">상점 NPC 이미지</h1>
          <FileDragAndDrop css={"mt-2 w-full col-span-3 h-[500px]"} id={`market_img_npc`} type={"image/"} text={savedImage ? null : "Drag Or Click"} image={getImageUrl(savedImage)} objectFit={"fill"} extFunc={imgInitFn} />
          <div className="relative col-span-8 grid grid-cols-8">
            <div className="relative col-span-8 mt-2 user-itemlist h-[455px] border overflow-y-auto">
              <h3 className="text-center font-bold text-2xl">상점 아이템 리스트</h3>
              <div className="flex flex-wrap w-full row-gap-0 min-h-10 h-fit bg-slate-100 ">
                {itemList &&
                  itemList.map((item, index) => (
                    <Tooltip key={`${item}-${index}`} content={<span>이것은 테스트 툴팁입니다!</span>} css={"w-1/6"}>
                      <InputTextList nolabel={true} readonly={true} default={item} id={`market_item_${index}`} type={"text"} css={"text-center border"} deleteButton={true} deleteFunc={deleteItem} />
                    </Tooltip>
                  ))}
              </div>
            </div>
            <div className="flex flex-wrap col-span-9 row-gap-0 min-h-10 h-fit bg-slate-100 items-center justify-center">
              <h3 className="text-center font-bold text-2xl mr-4">상점 아이템 추가</h3>
              <GridInputText nolabel={true} id={"market_item_add"} type={"text"} css={"text-center border"} />
              <GridInputButton label={"추가"} type={"button"} onclick={(e) => addItem(e)} />
            </div>
          </div>
          <div className="relative col-span-1 flex flex-col mr-3 h-[500px] overflow-y-auto">
            <h3 className="text-center font-bold text-2xl">아이템</h3>
            <div className="flex flex-wrap w-full row-gap-0 h-fit bg-slate-100">
              {Object.keys(allItems).map((key, index) => {
                return (
                  <Tooltip key={index} content={<span>{allItems[key].item_desc}</span>} css={"w-full"}>
                    <ListItemIndex index={index} label={allItems[key].item_name} onclick={clickItem} />
                  </Tooltip>
                );
              })}
            </div>
          </div>
          <h1 className="mt-8 font-bold text-2xl col-span-12">상점 NPC 기본 대화 관리</h1>
          <GridInputTextArea id={"market_text"} type={"text"} colSpan={12} default={`오늘은 어떤 물품을 교환하시겠어요? \r\n천천히 둘러보세요~`} css="border-b" />
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
      </div>
      <Autocomplete id={"#market_item_add"} data={allItems} autokey={"item_name"} />
      {noti && <NotificationModal message={noti} onClose={() => setNoti(null)} />}
    </div>
  );
}
