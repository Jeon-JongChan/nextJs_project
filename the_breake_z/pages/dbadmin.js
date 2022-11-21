import InputButton from "/page_components/Grid/GridInputButton";

export default function Home() {
    const callDrop = async () => await fetch("http://localhost:3000/api/dbadmin?query=drop");
    const callCreate = async () => await fetch("http://localhost:3000/api/dbadmin?query=create");
    const callCInsertInit = async () => await fetch("http://localhost:3000/api/dbadmin?query=insert_init");
    const callSelect = async () => {
        let res = await fetch("http://localhost:3000/api/dbadmin?query=select");
        let data = await res.json();
        console.log("callSelect : ", data);
    };

    return (
        <div className="my-2">
            <div className="shadow rounded-md">
                <div className="bg-white px-4 py-3">
                    <div className="grid grid-cols-6 gap-6">
                        <InputButton label={"DROP"} onclick={callDrop} type="button" colSpan={1}></InputButton>
                        <InputButton label={"CREATE"} onclick={callCreate} type="button" buttonColor={"red"} colSpan={1}></InputButton>
                        <InputButton label={"SELECT"} onclick={callSelect} type="button" colSpan={1}></InputButton>
                        <InputButton label={"InsertInit"} onclick={callCInsertInit} type="button" buttonColor={"red"} colSpan={1}></InputButton>
                        <InputButton label={"Delete"} type="button" colSpan={1}></InputButton>
                        <InputButton label={"Delete"} type="button" buttonColor={"red"} colSpan={1}></InputButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
