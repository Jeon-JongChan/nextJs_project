/* next Module */
import ListItem from "/page_components/public/ListItem";
import { LocalDataContext } from "/page_components/MyContext";
import { useContext, useEffect, useState, useRef } from "react";
import { initAutoComplete } from "/scripts/client/autoComplete";
import { updateCheck } from "/scripts/client/client";
import { asyncInterval, devLog } from "/scripts/common";

/**
 * @param {string} [tabType] 리스트 입력 및 출력 타입
 * @param {string} [uniquetag] 리스트 입력 및 출력 타입
 * @param {int} [syncTime] 리스트 입력 및 출력 타입
 * @returns
 */
export default function Component(props) {
    const localData = useContext(LocalDataContext);
    const syncListRef = useRef();
    const syncNodeRef = useRef();

    const [list, setList] = useState([]);
    const componentType = props?.tabType || "boilerplate";
    const idUniqueTag = props?.uniquetag || "i-";
    const syncTime = props?.syncTime || 2;

    useEffect(() => {
        setTimeout(init, 1000);
    }, []);

    async function init() {
        // console.log(" boilerpalte LIst ", syncNodeRef.current);
        syncList();
        if (!syncListRef.current) {
            syncListRef.current = new asyncInterval(() => {
                // devLog("syncListRef : localData", localData, syncListRef.current);
                syncList();
            }, syncTime);
            syncListRef.current.start();
        }
    }
    /**
     * 리스트를 동기화 시켜주는 함수
     * @param {*} localData 동기화할 데이터
     * @param {*} componentType 동기화할 데이터의 타입
     * @param {*} syncNodeRef 동기화할 노드
     */
    async function syncList() {
        if (localData.status) {
            // devLog("syncList is start", localData);
            try {
                let checkData = {};
                checkData.cnt = Number(syncNodeRef.current.getAttribute("data-cnt"));
                checkData.lastid = Number(syncNodeRef.current.getAttribute("data-lastid"));
                checkData.update_dt = syncNodeRef.current.getAttribute("data-updatedt");

                if (updateCheck(localData.status, checkData, "syncList : " + componentType)) {
                    setList(localData?.[componentType]);
                }
            } catch (e) {
                devLog("syncList - error", e);
            }
        } else {
            devLog("syncList : localData.status is false", localData);
        }
    }

    /**
     * 아이템을 클릭할 경우 정보를 오른쪽에 표기해주는 클릭이벤트
     * @param {*} e 이벤트
     */
    async function clickListItem(e) {
        event.stopPropagation();
        let name = e.target.getAttribute("data-name");
        let inputData = localData[componentType].find((data) => data.NAME === name);
        if (!inputData) {
            devLog("clickListItem - inputData is null", " : ", inputData);
            return;
        }
        // devLog("clickListItem - " + componentType, " : ", inputData);

        let inputNameList = ["name", "page", "text"];
        let dataNameObject = {
            name: "NAME",
            page: "PAGE",
            text: "TEXT",
        };

        let inputs = [];
        let textArea;
        for (let inputName of inputNameList) {
            let node = document.getElementById(idUniqueTag + inputName);
            inputs.push(node);
            textArea = node;
        }

        for (let input of inputs) {
            for (let inputName of inputNameList) {
                if (input.id === idUniqueTag + inputName) {
                    input.value = inputData[dataNameObject[inputName]];
                }
            }
        }
        // 이벤트 발생으로 textArea의 높이를 조절해준다.
        // devLog("clickListItem - textArea", " : ", textArea);
        textArea.dispatchEvent(new Event("input"));
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="bg-white">
                    <div className="mx-auto py-2 px-4">
                        <h2 className="sr-only">Products</h2>
                        <div
                            ref={syncNodeRef}
                            className={componentType + "-list grid gap-y-1 gap-x-6 max-h-screen min-w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}
                            data-cnt={0}
                            data-lastid={0}
                            data-updatedt={""}
                        >
                            {list?.length > 0 ? list.map((data, idx, array) => <ListItem key={idx} label={data.NAME} onclick={clickListItem}></ListItem>) : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
/**
 * 할당해야될 tawind 모듈 임포트를 위해 선언
 */
const tawind = {
    visible: "visible",
    invisible: "invisible",
};
