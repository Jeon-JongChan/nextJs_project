"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import GridInputSelectBox from "@/_custom/components/_common/grid/GridInputSelectBox";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import NotificationModal from "@/_custom/components/NotificationModal";
import ListItemIndex from "/_custom/components/_common/ListItemIndex";
import {getImageUrl} from "@/_custom/scripts/client";

const menuName = "raid";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [userlist, setUserList] = useState([]);
  const [listCount, setListCount] = useState(0);
  const [clickedIndex, setClickedIndex] = useState(null);
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
          devLog(`delete-${menuName}list success : `, data, target);
        })
        .catch((error) => console.error("Error:", error));
    } catch (e) {
      console.error(`delete-${menuName} error : `, e.message);
    }
  };

  const deleteUser = (e) => {
    e.preventDefault();
    const inputElements = e.target.parentElement.parentElement.querySelectorAll("input");
    let username, order;
    inputElements.forEach((input) => {
      if (input.id.startsWith("raid_user_")) username = input.value;
      else if (input.id.startsWith("raid_order_")) order = input.value;
    });

    devLog(`delete user list ** ${menuName} **`, username, order);
    if (username) {
      const formData = new FormData();
      formData.append("apitype", "delete_raid_list");
      formData.append(`raid_name`, maindata?.[clickedIndex].raid_name);
      formData.append(`raid_user`, username);
      formData.append(`raid_order`, order);

      try {
        fetch("/api/admin/delete", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            inputElements.forEach((input) => (input.value = ""));
            let temp = maindata;
            temp[clickedIndex].userlist = temp[clickedIndex].userlist.filter((user) => user.raid_user !== username);
            setMainData(temp);
            setNoti(`${username} 삭제되었습니다.`);
          })
          .catch((error) => console.error("Error:", error));
      } catch (e) {
        console.error(`delete-${menuName} error : `, e.message);
      }
    }
  };

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
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 1000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  // 데이터 클릭시 값을 입력해주기
  const clickListItem = (e) => {
    setUserList([]);
    // const name = e.target.dataset.name;
    const listIndex = e.target.dataset.index;
    setClickedIndex(listIndex);
    if (maindata?.[listIndex]?.total_user) setListCount(maindata?.[listIndex].total_user);
    else setListCount(0);
  };

  useEffect(() => {
    const userlist = maindata?.[clickedIndex]?.userlist;
    if (userlist) {
      // 1. 일반 input 값 채우기
      const updataFormInputList = document.querySelectorAll(`.${menuName}-form form input`);
      updataFormInputList.forEach((input) => {
        input.value = null;
        const index = parseInt(input.id.split("_").pop()) + 1;
        let targetUser = userlist.filter((user) => user.raid_order == index)[0];
        if (input.id.startsWith("raid_user_")) input.value = targetUser?.raid_user || null;
        else if (input.id.startsWith("raid_order_")) input.value = targetUser?.raid_order || null;
        // devLog("clicked useEffect input", input.id, input.value, index <= userlist.length);
      });
    }

    // 필수 요소 채우기
    const data = maindata?.[clickedIndex];
    let tempElement = document.querySelector(`#raid_name`);
    if (tempElement) tempElement.value = data?.raid_name || null;
    tempElement = document.querySelector(`#monster_name`);
    if (tempElement) tempElement.value = data?.monster_name || null;
    tempElement = document.querySelector(`#raid_reader`);
    if (tempElement) tempElement.value = data?.raid_reader || null;
    tempElement = document.querySelector(`#total_user`);
    if (tempElement) tempElement.value = data?.total_user || null;

    devLog("clickListItem", data, document.querySelector(`#raid_name`), document.querySelector(`#monster_name`), document.querySelector(`#raid_reader`), document.querySelector(`#total_user`));
  }, [clickedIndex]);

  return (
    <div className="flex w-full">
      <div className={`w-full flex flex-col ${menuName}-form`}>
        <form onSubmit={handleSubmitUser} data-apitype={`update_${menuName}`} className="flex gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100 w-full" style={{minHeight: "400px"}}>
          <div className="w-2/12 flex flex-col mr-3 h-screen overflow-y-auto">
            <h3 className="text-center font-bold text-2xl">레이드리스트</h3>
            <div className="flex flex-wrap w-full row-gap-0 h-fit bg-slate-100 max-h-screen overflow-y-auto">
              {Object.keys(maindata).map((key, index) => {
                if (maindata[key]["raid_name"]) {
                  return <ListItemIndex key={index} index={index} label={maindata[key]["raid_name"]} onclick={clickListItem} deleteButton={true} deleteFunc={deleteTarget} alignDir={"left"} css="w-full border bg-white" />;
                }
              })}
            </div>
          </div>
          <div className="w-10/12 flex flex-col mr-3">
            <h1 className="text-center font-bold text-2xl">레이드 정보</h1>
            {/* listCount 만큼 array를 만들고 map 생성 */}
            <div className="grid grid-cols-12 gap-4">
              <GridInputText label="레이드 이름" readonly={true} id="raid_name" type="text" colSpan={6} css="border-b" default={maindata?.[clickedIndex]?.raid_name} />
              <GridInputText label="몬스터 이름" readonly={true} id="monster_name" type="text" colSpan={6} css="border-b" default={maindata?.[clickedIndex]?.monster_name} />
              <GridInputText label="리더" id="raid_reader" type="text" colSpan={6} css="border-b" default={maindata?.[clickedIndex]?.raid_reader} />
              <GridInputText label="유저 수" id="total_user" type="text" colSpan={6} css="border-b" default={maindata?.[clickedIndex]?.total_user} />
            </div>
            {listCount &&
              Array.from({length: listCount}).map((_, index) => {
                return (
                  <div className="grid grid-cols-12 gap-4" key={index}>
                    <GridInputText label="유저 이름" id={`raid_user_${index}`} type="text" colSpan={4} css="border-b" default={userlist?.[index]?.raid_user} />
                    <GridInputText label="유저 순서" id={`raid_order_${index}`} type="text" colSpan={4} css="border-b" default={userlist?.[index]?.raid_order} />
                    <GridInputButton
                      label="삭제"
                      type="button"
                      colSpan={4}
                      css={`border-b`}
                      onclick={(e) => {
                        deleteUser(e, `raid_user_${index}`);
                      }}
                    />
                  </div>
                );
              })}
            <GridInputButton colSpan={12} label={"submit"} type="submit" />
          </div>
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
