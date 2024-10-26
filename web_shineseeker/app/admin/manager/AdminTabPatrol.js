"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import React, {useState, useEffect} from "react";
import {devLog} from "@/_custom/scripts/common";
import ListItemIndex from "/_custom/components/_common/ListItemIndex";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import GridInputSelectBox from "/_custom/components/_common/grid/GridInputSelectBox";
import GridInputTextArea from "/_custom/components/_common/grid/GridInputTextArea";
import GridFile from "/_custom/components/_common/grid/GridFile";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";
import Tooltip from "@/_custom/components/_common/Tooltip";

const menuName = "patrol";
export default function Home() {
  const [maindata, setMainData] = useState([]);
  const [clickImage, setClickImage] = useState(null);
  const [patrolOptionList, setPatrolOptionList] = useState({});
  let fetchIndex = 0;
  /* 입력 Input 조절에 쓰일 state */
  const [inputOptionList, setInputOptionList] = useState([0, 1, 2]);

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
  };

  const clickListItem = (e) => {
    const name = e.target.dataset.name;
    const listIndex = e.target.dataset.index;
    const data = maindata?.[listIndex];
    devLog("clickListItem", patrolOptionList, maindata);
    if (data) {
      // 1. 일반 input 값 채우기
      const updataFormInputList = document.querySelectorAll(`.${menuName}-form form input`);
      devLog("clickUser", name, data, clickImage);

      updataFormInputList.forEach((input) => {
        if (input.id.startsWith(`${menuName}_img`) || input.id.startsWith(`${menuName}_ret_img`)) return; // 특수 input은 제외
        try {
          input.value = data[input.id] || "init";
        } catch (e) {
          console.error(input, e);
        }
      });
      // 2. 이미지 채우기
      setClickImage(data?.[`${menuName}_img`]);
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
      // 5. 결과 부분 file input의 span 채우기
      const spanElements = document.querySelectorAll(`.${menuName}-form form .grid-file span`);
      spanElements.forEach((span) => {
        const spanId = span.id.replace("_span", "");
        devLog("clickuser span", span, span.id.replace("_span", ""), data[spanId]);
        span.textContent = data[spanId] ? data[spanId].replace("/temp/uploads/", "") : "선택된 파일 없음";
      });
    }
  };

  const manageOption = (status = 1) => {
    if (status > 0) setInputOptionList([...inputOptionList, ...Array(status).map((_, index) => inputOptionList.length + index)]);
    else setInputOptionList(inputOptionList.slice(0, inputOptionList.length - 1));
  };

  async function fetchEssentialData() {
    console.info("ADMIN DATA MANAGEMENT PAGE : 패트롤 항목 선택되었습니다.");
    const response = await fetch("/api/select?apitype=patrol_result&getcount=1");
    const newData = await response.json();
    if (newData?.data?.length) {
      // 패트롤 상세정보를 input과 select에 넣기
      const optionList = {};
      for (const key of Object.keys(newData.data[0])) {
        if (key.startsWith("updated")) continue;
        document.querySelector(`#${key}`).value = newData.data[0][key]; // input에 기본값 넣기
        let id = key.replace("_option", "");
        optionList[id] = newData.data[0][key].split(",");
      }
      setPatrolOptionList({...optionList});
    }
    console.log("essential data item detail: ", newData);
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
    const intervalId = setInterval(fetchData, 10 * 1000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full">
      <div className="w-1/5 flex flex-col mr-3 ">
        <h3 className="text-center font-bold text-2xl">패트롤리스트</h3>
        <div className="flex flex-wrap w-full row-gap-0 h-fit bg-slate-100">
          {Object.keys(maindata).map((key, index) => {
            if (maindata[key]["patrol_name"]) {
              return (
                <Tooltip key={index} content={<span>{maindata[key]["patrol_desc"]}</span>} css={"w-full"}>
                  <ListItemIndex label={maindata[key]["patrol_name"]} onclick={clickListItem} />
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
          <div className="relative col-span-12 mt-4 flex gap-1">
            <div className="block w-1/4">
              <label htmlFor="patrol_img" className="block text-2xl font-bold">
                출력이미지
              </label>
              <FileDragAndDrop css={"mt-2 w-full col-span-4 h-[200px]"} id={`patrol_img`} type={"image/"} text={clickImage ? null : "Drag Or Click"} image={clickImage} objectFit={"fill"} />
            </div>
          </div>
          <h1 className="mt-8 col-span-full font-bold text-2xl">항목설정</h1>
          <GridInputSelectBox label={"패트롤 종류"} id={"patrol_type"} type={"text"} colSpan={3} options={patrolDefaultList.patrol_option_type} />
          <GridInputText label={"패트롤 이름"} id={"patrol_name"} type={"text"} colSpan={4} css="border-b h-[36px]" />
          <div className="col-span-full" />
          <GridInputTextArea label={"설명"} id={"patrol_desc"} type={"text"} colSpan={12} css={"border-b"} />

          <h1 className="mt-8 col-span-full font-bold text-2xl">패트롤 상세설정</h1>
          {inputOptionList.map((_, index) => {
            return <GridInputText key={index} nolabel={true} default={`선택지 ${index + 1} 글`} id={`patrol_select_${index}`} type={"text"} colSpan={12} css="border-b h-[36px]" />;
          })}
          <div className="col-span-4" />
          <GridInputButton colSpan={4} label={"선택지 추가 삭제"} type="button" buttonColor="red" onclick={() => manageOption(0)} />
          <GridInputButton colSpan={4} label={"선택지 추가 생성"} type="button" onclick={() => manageOption()} />

          <h1 className="mt-8 col-span-full font-normal text-xl">보상받을 조건</h1>
          {["ATK", "DEF", "WIS", "AGI", "LUK"].map((item, index) => {
            return <GridInputText key={index} label={item} id={`patrol_${item.toLowerCase()}`} type={"number"} colSpan={2} css="border-b h-[36px]" />;
          })}
          <div className="col-span-full" />

          <h1 className="mt-8 col-span-full font-normal text-2xl">패트롤 결과 재화</h1>
          {inputOptionList.map((_, index) => {
            let option = index === 0 ? {type: "종류", money: "재화", count: "개수", img: "출력이미지", msg: "메세지"} : {};
            return <React.Fragment key={index}>{makeRetOptionGenerator(index, option)}</React.Fragment>;
          })}
          <span className="col-span-1 relative row flex items-end justify-center font-bold text-red-500">조건미달</span>
          <GridInputSelectBox id={`patrol_fail_type`} type={"text"} colSpan={2} options={patrolDefaultList.patrol_option_item} />
          <GridInputText id={`patrol_fail_money`} type={"text"} colSpan={2} css="border-b h-[36px]" />
          <GridInputText id={`patrol_fail_count`} type={"text"} colSpan={2} css="border-b h-[36px]" />
          <GridFile id={`patrol_img_fail`} colSpan={5} buttonWidth={"w-1/4"} />
          <div className="col-span-1" />
          <GridInputText id={`patrol_fail_msg`} type={"text"} colSpan={11} css="border-b h-[36px]" />
          <style jsx>{`
            @keyframes scrollText {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-100%);
              }
            }
          `}</style>
          <GridInputButton colSpan={12} label={"submit"} type="submit" />
        </form>
      </div>
    </div>
  );
}

function makeRetOptionGenerator(index, option = {}) {
  return (
    <React.Fragment key={index}>
      <span className={["col-span-1 relative row flex items-end justify-center font-bold", option?.spanCss ? option?.spanCss : ""].join(" ")}>
        {option.span ? option?.span : `${index + 1} 선택지`}
      </span>
      <GridInputSelectBox label={option?.type} id={`patrol_ret_type_${index}`} type={"text"} colSpan={2} options={patrolDefaultList.patrol_option_item} />
      <GridInputText label={option?.money} id={`patrol_ret_money_${index}`} type={"text"} colSpan={2} css="border-b h-[36px]" />
      <GridInputText label={option?.count} id={`patrol_ret_count_${index}`} type={"text"} colSpan={2} css="border-b h-[36px]" />
      <GridFile label={option?.img} id={`patrol_ret_img_${index}`} colSpan={5} buttonWidth={"w-1/4"} />
      <div className="col-span-1" />
      <GridInputText label={option?.msg} id={`patrol_ret_msg_${index}`} type={"text"} colSpan={11} css="border-b h-[36px]" />
    </React.Fragment>
  );
}

const patrolDefaultList = {
  patrol_option_type: ["도와주기", "출현!"],
  patrol_option_item: ["AKA", "에고"],
};
