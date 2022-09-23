/* next Module */
import Script from "next/script";
import Nav from "/page_components/Nav";
import PoketmonInput from "/page_components/PoketmonInput";
// * react
export default function Layout() {
    return (
        <>
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
                <div className="flex flex-col w-2/4">포켓몬 나오는 부분</div>
                <div className="flex flex-col w-2/4">
                    <PoketmonInput></PoketmonInput>
                </div>
            </div>
        </>
    );
}
