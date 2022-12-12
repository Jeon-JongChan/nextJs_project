import { LocalDataContext, HostContext, AdminSyncContext, AdminSyncDataContext } from "/page_components/MyContext";
import { useRef, useState } from "react";
import AdminBoilerplate from "/page_components/admin_boilerplate/AdminBoilerplate";
export default function Home() {
    const localData = useRef({});
    const adminSync = useRef({});
    // const adminSyncData = useRef("");
    return (
        <LocalDataContext.Provider value={localData.current}>
            <AdminSyncContext.Provider value={adminSync.current}>
                {/* <AdminSyncDataContext.Provider value={adminSyncData.current}> */}
                <AdminBoilerplate></AdminBoilerplate>
            </AdminSyncContext.Provider>
        </LocalDataContext.Provider>
    );
}
