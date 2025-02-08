import GridInputButton from "/page_components/Grid/GridInputButton";
import GridInputText from "/page_components/Grid/GridInputText";

export default function Home() {
    const host = process.env.NEXT_PUBLIC_HOST;
    const callDBApi = async (queryType, table = null) => {
        if (table) await fetch(host + `/api/dbadmin?query=${queryType}&table=${table}`);
        else await fetch(host + `/api/dbadmin?query=${queryType}`);
    };
    const callApi = async (apiType) => {
        await fetch(host + `/api/admin?state=${apiType}`);
    };
    return (
        <>
            <div className="my-2">
                <div className="shadow rounded-md">
                    <div className="bg-white px-4 py-3">
                        <div className="grid grid-cols-8 gap-3">
                            <p className="px-1 py-3 inline-block">전체 대상 : </p>
                            <GridInputButton label={"DROP"} onclick={() => callDBApi("drop")} type="button" colSpan={1}></GridInputButton>
                            <GridInputButton label={"CREATE"} onclick={() => callDBApi("create")} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
                            <GridInputButton label={"InsertInit"} onclick={() => callDBApi("insert_init")} type="button" buttonColor={"red"} colSpan={1}></GridInputButton>
                            <GridInputButton label={"TABLES"} onclick={() => callDBApi("tables")} type="button" colSpan={1}></GridInputButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-2">
                <div className="shadow rounded-md">
                    <div className="bg-white px-4 py-3">
                        <div className="grid grid-cols-8 gap-1">
                            <GridInputText id={"tablename"} label={"TABLE NAME"} type="text" colSpan={4}></GridInputText>
                            <GridInputButton
                                label={"SELECT ALL"}
                                onclick={() => {
                                    let tablename = document.querySelector("#tablename").value;
                                    callDBApi("select", tablename);
                                }}
                                type="button"
                                colSpan={1}
                            ></GridInputButton>
                            <GridInputButton
                                label={"TRUNCATE"}
                                onclick={() => {
                                    let tablename = document.querySelector("#tablename").value;
                                    callDBApi("truncate", tablename);
                                }}
                                type="button"
                                colSpan={1}
                            ></GridInputButton>
                            <GridInputButton
                                label={"Delete"}
                                onclick={() => {
                                    let tablename = document.querySelector("#tablename").value;
                                    callDBApi("delete", tablename);
                                }}
                                type="button"
                                buttonColor={"red"}
                                colSpan={1}
                            ></GridInputButton>
                            <GridInputButton
                                label={"query"}
                                onclick={() => {
                                    let tablename = document.querySelector("#tablename").value;
                                    callDBApi("query", tablename);
                                }}
                                type="button"
                                buttonColor={"blue"}
                                colSpan={1}
                            ></GridInputButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-2">
                <div className="shadow rounded-md">
                    <div className="bg-white px-4 py-3">
                        <div className="grid grid-cols-8 gap-3">
                            <p className="px-1 py-3 inline-block">매크로 시작 : </p>
                            <GridInputButton label={"START"} onclick={() => callApi("start")} type="button" colSpan={1}></GridInputButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
