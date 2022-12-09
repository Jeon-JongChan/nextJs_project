//import Head from 'next/head'
//import Image from 'next/image'
import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import { devLog } from "/scripts/common";

export default function Component() {
    let classNameBtn = "border-2 p-2 border-black m-1 inline-block";
    async function migrate(method) {
        let url = "/api/migration?method=" + method;
        let response = await fetch(url);
        let json = await response.json();
        devLog(response, json);
    }
    return (
        <>
            <div>
                <pre>firebase &lt;-&gt; 로컬서버간 데이터 마이그레이션</pre>
            </div>
            <div>
                <div className={classNameBtn}>
                    <button onClick={() => migrate("toLocal")}>FIREbase 서버에서 데이터를 가져옵니다.</button>
                </div>
                <div className={classNameBtn}>
                    <button onClick={() => migrate("toServer")}>로컬서버에서 FIREbase로 데이터를 보냅니다.</button>
                </div>
            </div>
        </>
    );
}
