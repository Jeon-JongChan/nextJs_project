import { LocalDataContext, HostContext, AdminSyncContext, AdminSyncDataContext } from "/page_components/MyContext";
import { useRef, useState } from "react";
import AdminBoilerplate from "/page_components/admin_boilerplate/AdminBoilerplate";
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
    return <AdminBoilerplate></AdminBoilerplate>;
}
