"use client";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import GridInputText from "/_custom/components/_common/grid/GridInputText";
import GridInputButton from "/_custom/components/_common/grid/GridInputButton";
import FileDragAndDrop from "/_custom/components/_common/FileDragAndDrop";

export default function Home(props) {
  const apitype = props?.apitype || "update_user";
  const apiurl = props?.apiurl || "upload";
  const handleSubmitUser = (e) => {
    e.preventDefault();
    console.log("handleSubmitUser", apitype, apiurl, props);
    updateDataWithFormInputs(e, apitype, apiurl);
  };

  return (
    <form onSubmit={handleSubmitUser} className="grid grid-cols-1 gap-1 shadow sm:overflow-hidden sm:rounded-md p-4 bg-slate-100" style={{minHeight: "400px"}}>
      <GridInputText label={"ID"} id={"userid"} />
      <GridInputText label={"PASSWORD"} id={"userpw"} />
      <GridInputText label={"NICKNAME"} id={"username"} />
      <GridInputText label={"프로필"} id={"profill"} />
      <GridInputText label={"직업"} id={"job"} />
      <GridInputText label={"레벨"} id={"level"} />
      <GridInputText label={"스탯"} id={"stat"} />
      <GridInputText label={"스킬"} id={"skill"} />
      <GridInputText label={"돈"} type={"number"} id={"money"} />
      <label htmlFor="drag-drop-img" className="block text-sm font-medium text-gray-700 row">
        캐릭터 프로필 이미지
      </label>
      <FileDragAndDrop css={"mt-2 w-full col-span-6"} type={"image/"} text={"이미지를 끌어오거나 클릭하세요!"} />
      <GridInputButton label={"submit"} type="submit" />
    </form>
  );
}
