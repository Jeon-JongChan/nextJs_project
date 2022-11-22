/* next Module */
import Script from "next/script";
import Head from "next/head";
import Nav from "/page_components/Nav";
import PoketmonInput from "/page_components/PoketmonInput";
import ImageLayoutText from "./public/ImageLayerText";
import ListButton from "./public/ListButton";
import { useState } from "react";
// * react
export default function Layout() {
    const [poketmonImages, setPoketmonImages] = useState([]);
    async function syncPoketmonList(localData) {
        let frameNode = document.querySelector(".poketmon-list");
        localData = await syncLocalData("poketmon", localData);
        let currentCnt = frameNode.getAttribute("data-cnt");
        let currentLastid = frameNode.getAttribute("data-lastid");

        let currentImages = poketmonImages;

        if (localData.poketmon.cnt != currentCnt || localData.poketmon.lastid != currentLastid) {
            let listItems = frameNode.querySelectorAll("img");
            let addData = localData.poketmon.data.map((data, idx) => {
                let name = data.NAME;
                let addCheck = true;
                for (let item of listItems) {
                    let alt = item.getAttribute("alt");
                    if (alt === name) {
                        addCheck = false;
                        break;
                    }
                }

                if (addCheck) {
                    let description = [
                        { name: "이름", content: data.NAME },
                        { name: "출몰지", content: data.LOCAL },
                        { name: "특성", content: "".concat(data.SPEC1, ",", data.SPEC2, ",", data.SPEC3) },
                        { name: "출현율", content: data.RARE },
                        { name: "레벨", content: "".concat(data.LEVEL_MIN, "~", data.LEVEL_MAX) },
                    ];
                    return <ImageLayoutText key={idx} imageSrc={data.PATH} imageAlt={data.NAME} layer={description}></ImageLayoutText>;
                }
            });
            console.log("operation syncPoketmonList sync : ", addData);
            setPoketmonImages(currentImages.concat(addData));
            frameNode.setAttribute("data-cnt", localData.poketmon.cnt);
            frameNode.setAttribute("data-lastid", localData.poketmon.lastid);
        }
        console.log("operation syncPoketmonList");
    }
    return (
        <>
            <Script
                src="/scripts/project_global.js"
                onLoad={async () => {
                    console.log("Layout lazyOnload");
                    setInterval(syncPoketmonList, 5000);
                }}
            />
            <Script src="/scripts/public.js" />
            <Nav></Nav>
            <div className="mt-2">
                <ul className="flex items-center justify-center space-x-4">
                    <button>
                        <li className="apply-tab-item">포켓몬 추가</li>
                    </button>
                    <button>
                        <li className="apply-tab-item">포켓몬 지역</li>
                    </button>
                    <button>
                        <li className="apply-tab-item">포켓몬 특성</li>
                    </button>
                </ul>
            </div>
            <div className="flex mt-4">
                <div className="flex flex-col w-2/4">
                    <div className="bg-white">
                        <div className="mx-auto max-w-2xl py-4 px-4">
                            <h2 className="sr-only">Products</h2>

                            <div className="poketmon-list grid grid-cols-4 gap-y-10 gap-x-6" data-cnt={0} data-lastid={0}>
                                {poketmonImages}
                            </div>
                        </div>
                    </div>
                </div>
                <form className="flex flex-row w-2/4">
                    <PoketmonInput></PoketmonInput>
                </form>
            </div>
        </>
    );
}
