//import Head from 'next/head'
//import Image from 'next/image'

import Admin from "/page_components/admin/Admin";
import { LocalDataContext, HostContext } from "/page_components/MyContext";

export default function Home() {
    let localData = {};
    let host = process.env.NEXT_PUBLIC_HOST || "";
    return (
        <LocalDataContext.Provider value={localData}>
            <HostContext.Provider value={host}>
                <Admin></Admin>
            </HostContext.Provider>
        </LocalDataContext.Provider>
    );
}
