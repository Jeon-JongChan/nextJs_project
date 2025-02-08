import GridInputText from "/page_components/Grid/GridInputText";
import GridInputTextArea from "/page_components/Grid/GridInputTextArea";
import GridInputButton from "/page_components/Grid/GridInputButton";
import GridInputSelectBox from "/page_components/Grid/GridInputSelectBox";
import {devLog} from "/scripts/common";

export default function Home() {
  const host = process.env.NEXT_PUBLIC_HOST || "";
  const callDrop = async () => await fetch(host + "/api/dbadmin?query=drop");
  const callTruncate = async () => await fetch(host + "/api/dbadmin?query=truncate");
  const callCreate = async () => await fetch(host + "/api/dbadmin?query=create");
  const callInsertInit = async () => await fetch(host + "/api/dbadmin?query=insert_init");
  const callDelete = async () => await fetch(host + "/api/dbadmin?query=delete");
  const callSelect = async () => {
    let res = await fetch(host + "/api/dbadmin?query=select");
    let data = await res.json();
    devLog("callSelect : ", data);
  };

  async function callOrder() {
    let order = document.querySelector("#i-order").value;
    if (order !== "") {
      let res = await fetch(host + `/api/dbadmin?query=${order}`);
    } else {
      devLog("callOrder : ", "order is empty");
    }
  }

  return (
    <>
      <div className="my-2">
        <div className="shadow rounded-md">
          <div className="bg-white px-4 py-3">
            <div className="grid grid-cols-6 gap-6">
              <GridInputButton label={"DROP"} onclick={callDrop} type="button" colSpan={1}></GridInputButton>
              <GridInputButton label={"CREATE"} onclick={callCreate} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
              <GridInputButton label={"SELECT"} onclick={callSelect} type="button" colSpan={1}></GridInputButton>
              <GridInputButton label={"InsertInit"} onclick={callInsertInit} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
              <GridInputButton label={"TRUNCATE"} onclick={callTruncate} type="button" colSpan={1}></GridInputButton>
              <GridInputButton label={"Delete"} onclick={callDelete} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
            </div>
          </div>
        </div>
      </div>
      <div id="adminpage-addBoilerplate" className="activate-tab">
        <div className="flex mt-4">
          <div className="flex flex-col w-3/5"></div>
          <form className="flex flex-row w-2/5">
            <div className="flex flex-col w-full">
              <div className="my-2">
                <div className="shadow rounded-md">
                  <div className="bg-white px-4 py-3">
                    <div className="input-frame grid grid-cols-6 gap-6">
                      <GridInputText id={`i-order`} label={"서버에 요청할 특수한 명령"} smallLabel={"* 일치하지 않을경우 실행 x"}></GridInputText>
                    </div>
                    <div className="grid grid-cols-6 gap-6 mt-4">
                      <div className="col-span-4"></div>
                      <GridInputButton type="button" colSpan={2} onclick={callOrder}></GridInputButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
