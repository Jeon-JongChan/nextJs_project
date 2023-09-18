import GridInputButton from "/page_components/Grid/GridInputButton";
import GridInputText from "/page_components/Grid/GridInputText";

export default function Home() {
    const host = process.env.NEXT_PUBLIC_HOST;
    const callSelectAll = async (tablename) => await fetch(host + "/api/dbadmin?query=select&table=" + tablename);
    const callDrop = async () => await fetch(host + "/api/dbadmin?query=drop");
    const callTruncate = async () => await fetch(host + "/api/dbadmin?query=truncate");
    const callCreate = async () => await fetch(host + "/api/dbadmin?query=create");
    const callInsertInit = async () => await fetch(host + "/api/dbadmin?query=insert_init");
    const callDelete = async () => await fetch(host + "/api/dbadmin?query=delete");
    const callTables = async () => await fetch(host + "/api/dbadmin?query=tables");
    return (
        <>
            <div className="my-2">
                <div className="shadow rounded-md">
                    <div className="bg-white px-4 py-3">
                        <div className="grid grid-cols-6 gap-6">
                            <GridInputButton label={"DROP"} onclick={callDrop} type="button" colSpan={1}></GridInputButton>
                            <GridInputButton label={"CREATE"} onclick={callCreate} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
                            <GridInputButton label={"InsertInit"} onclick={callInsertInit} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
                            <GridInputButton label={"TRUNCATE"} onclick={callTruncate} type="button" colSpan={1}></GridInputButton>
                            <GridInputButton label={"Delete"} onclick={callDelete} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
                            <GridInputButton label={"TABLES"} onclick={callTables} type="button" colSpan={1}></GridInputButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-2">
                <div className="shadow rounded-md">
                    <div className="bg-white px-4 py-3">
                        <div className="grid grid-cols-6 gap-6">
                            <GridInputText id={"tablename"} label={"TABLE NAME"} type="text" colSpan={3}></GridInputText>
                            <GridInputButton
                                label={"SELECT ALL"}
                                onclick={() => {
                                    let tablename = document.querySelector("#tablename").value;
                                    callSelectAll(tablename);
                                }}
                                type="button"
                                colSpan={3}
                            ></GridInputButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
