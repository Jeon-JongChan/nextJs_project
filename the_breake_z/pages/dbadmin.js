import InputButton from "/page_components/Grid/GridInputButton";
import { devLog } from "/scripts/common";

export default function Home() {
    const host = process.env.NEXT_PUBLIC_HOST;
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

    return (
        <div className="my-2">
            <div className="shadow rounded-md">
                <div className="bg-white px-4 py-3">
                    <div className="grid grid-cols-6 gap-6">
                        <InputButton label={"DROP"} onclick={callDrop} type="button" colSpan={1}></InputButton>
                        <InputButton label={"CREATE"} onclick={callCreate} type="button" buttonColor={"red"} colSpan={1}></InputButton>
                        <InputButton label={"SELECT"} onclick={callSelect} type="button" colSpan={1}></InputButton>
                        <InputButton label={"InsertInit"} onclick={callInsertInit} type="button" buttonColor={"red"} colSpan={1}></InputButton>
                        <InputButton label={"TRUNCATE"} onclick={callTruncate} type="button" colSpan={1}></InputButton>
                        <InputButton label={"Delete"} onclick={callDelete} type="button" buttonColor={"red"} colSpan={1}></InputButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
