/* next Module */
import Script from "next/script";
import Head from "next/head";
import Nav from "/page_components/Nav";
import PoketmonInput from "/page_components/PoketmonInput";
import ImageLayoutText from "./public/ImageLayerText";
import ListButton from "./public/ListButton";
// * react
export default function Layout() {
    async function syncPoketmonList() {
        let frameNode = document.querySelector("poketmon");
    }
    return (
        <>
            <Script src="/scripts/project_global.js" />
            <Script src="/scripts/public.js" />
            <Script
                strategy="lazyOnload"
                onLoad={async () => {
                    if (typeof localData === undefined) {
                        console.log("Layout localData undefined!. 1초간 대기합니다.");
                        sleep(2000);
                    }
                }}
            />
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

                            <div className="poketmon-list grid grid-cols-4 gap-y-10 gap-x-6">
                                {/* {poketmons.length > 0 ? poketmons.map((object, idx) => <ImageLayoutText key={idx} {...object}></ImageLayoutText>) : ""} */}
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
