//import Head from 'next/head'
//import Image from 'next/image'

import Admin from "/page_components/admin/Admin";
import { LocalDataContext, HostContext, AdminSyncContext, AdminSyncDataContext } from "/page_components/MyContext";
import { useRef, useState } from "react";
export default function Home() {
    // const [adminSync, setAdminSync] = useState("");
    const adminSync = useRef("");
    const adminSyncData = useRef("");
    adminSyncData.current = {
        poketmon: [],
        local: [],
        spec: [],
        personality: [],
    };
    let localData = useRef({});
    let host = process.env.NEXT_PUBLIC_HOST || "";
    return (
        <LocalDataContext.Provider value={localData}>
            <HostContext.Provider value={host}>
                <AdminSyncContext.Provider value={adminSync}>
                    <AdminSyncDataContext.Provider value={adminSyncData}>
                        <Admin></Admin>
                    </AdminSyncDataContext.Provider>
                </AdminSyncContext.Provider>
            </HostContext.Provider>
        </LocalDataContext.Provider>
    );
}
