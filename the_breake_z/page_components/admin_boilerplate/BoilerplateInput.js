/* next Module */
import Script from "next/script";
import GridInputText from "/page_components/Grid/GridInputText";
import GridInputTextArea from "/page_components/Grid/GridInputTextArea";
import GridInputButton from "/page_components/Grid/GridInputButton";
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import AreaBorder from "/page_components/public/AreaBorder";
import {LocalDataContext, HostContext, AdminSyncContext} from "/page_components/MyContext";
import {useContext, useEffect} from "react";
import {initAutoComplete} from "/scripts/client/autoComplete";
import {submitAdminMutipleData, submitAdminDelete} from "/scripts/client/client";
/**
 * @param {string[]} [pageList] select 옵션값
 * @param {string} [target]
 * @param {string} [type]
 * @param {string} [uniquetag]
 * @returns
 */
export default function Component(props) {
  const adminSync = useContext(AdminSyncContext);
  const pageList = props?.pageList || [];
  const target = props?.target || "boilerplate";
  const type = props?.type || "상용구";
  const idUniqueTag = props?.uniquetag || "i-";
  const useVarList = props?.useVarList || null;
  const useVarListEx = props?.useVarListEx || null;

  function clickSubmit() {
    let inputNameList = ["name", "page", "type", "text"];
    let inputTypeList = ["input", "select", "textarea"];
    submitAdminMutipleData(target, inputTypeList, inputNameList, idUniqueTag, adminSync);
    adminSync.sync("boilerplate clickSubmit");
  }
  function clickDelete() {
    submitAdminDelete(target, idUniqueTag, adminSync);
    adminSync.sync("boilerplate clickDelete");
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="my-2">
          <div className="shadow rounded-md">
            <div className="bg-white px-4 py-3">
              <div className={target + "input-frame grid grid-cols-6 gap-2"}>
                <GridInputText id={`${idUniqueTag}name`} label={"상용구 이름"} smallLabel={"* 삭제할경우 필수 요인"}></GridInputText>
                <GridInputSelectBox id={`${idUniqueTag}page`} colSpan={3} label={"상용구 사용 페이지"} options={pageList}></GridInputSelectBox>
                <GridInputText id={`${idUniqueTag}type`} colSpan={3} label={"상용구 타입"} default={type} readonly={true}></GridInputText>
                {useVarList ? <GridInputTextArea id={`${idUniqueTag}var-list0`} colSpan={6} label={"사용 가능 변수 리스트"} default={useVarList} readonly={true} maxHeight={50} css={"text-[12px]"}></GridInputTextArea> : null}
                {useVarListEx ? <div className="relative col-span-6 text-red-800 text-[12px]"> 예시 : {useVarListEx}</div> : null}
                <AreaBorder css={"col-span-6"}></AreaBorder>
                <GridInputTextArea id={`${idUniqueTag}text`}></GridInputTextArea>
                <GridInputButton label={"Delete"} buttonColor={"red"} colSpan={4} type="button" onclick={clickDelete}></GridInputButton>
                <GridInputButton type="button" colSpan={2} onclick={clickSubmit}></GridInputButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
/**
 * 할당해야될 tawind 모듈 임포트를 위해 선언
 */
const tawind = {
  visible: "visible",
  invisible: "invisible",
};
