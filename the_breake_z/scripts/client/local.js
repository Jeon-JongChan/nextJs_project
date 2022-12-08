import { syncData, updateCheck } from "/scripts/client/client";
export { syncListFunc };
/**
 * 데이터를 계속 갱신해서 보여준다.
 */
async function syncListFunc(target = "poketmon", syncDataList) {
    //document 가 없는 경우는 서버사이드 렌더링이므로 무시
    if (typeof document === "undefined") {
        console.log("syncList - document is undefined.");
        return;
    }
    let frameNode;
    let targetTag;
    let checkData;
    let syncDataStatus;

    try {
        frameNode = document.querySelector("." + target + "-list");
        targetTag = "";
        // console.log("syncList target : ", target, localData);
        if (target === "poketmon") targetTag = "img";
        else if (target === "local") targetTag = "div";
        else if (target === "spec") targetTag = "div";
        else if (target === "personality") targetTag = "div";

        if (!frameNode) {
            console.log("syncList frameNode : " + target + "-list is not found");
            return null;
        }
        localData[target] = await syncData(target, localData[target] || {}, "syncList : " + target);

        checkData = {};
        checkData.cnt = Number(frameNode.getAttribute("data-cnt"));
        checkData.lastid = Number(frameNode.getAttribute("data-lastid"));
        checkData.update_dt = frameNode.getAttribute("data-updatedt");

        syncDataStatus = localData[target].status;
    } catch (e) {
        console.log("syncList error : ", e.message, " document typeof : ", typeof document);
    }

    // 삭제된 정보가 있을경우 리스트에서 삭제해준다.
    syncDataList[target] = syncDataList[target].filter((v1, idx) => {
        let deleteCheck = false;
        localData[target].data.forEach((v2, idx) => {
            if (v1.NAME === v2.NAME) {
                // if (target === "poketmon") console.log("status : ", v1.NAME === v2.NAME, "v1.NAME : ", v1.NAME, "v2.NAME", v2.NAME);
                deleteCheck = true;
            }
        });
        return deleteCheck;
    });

    if (updateCheck(syncDataStatus, checkData, "syncList : " + target)) {
        let listItems = frameNode.querySelectorAll(targetTag);
        let addData = localData[target].data.filter((data, idx) => {
            // console.log("syncPoketmonList map : ", data, listItems);
            let name = data.NAME;
            let addCheck = true;

            // 정보 업데이트를 대비한 정보 업데이트
            syncDataList[target].forEach((v, idx) => {
                if (v.NAME === data.NAME) syncDataList[target][idx] = data;
            });

            for (let v of listItems) {
                let alt = v.dataset.name;
                if (alt === name) {
                    addCheck = false;
                    break;
                }
            }

            if (addCheck) {
                return data;
            }
        });
        // if (target === "poketmon") console.log("syncList : ", target, " add data : ", ...addData, " syncDataList : ", syncDataList, " images : ", images);
        if (addData) {
            // 아무래도 js 밖에서 돌리다 보니 제대로된 저장이 안되는 느낌
            syncDataList[target] = [...syncDataList[target], ...addData];
            if (target === "poketmon") setImages([...syncDataList[target]]);
            else if (target === "local") setLocals([...syncDataList[target]]);
            else if (target === "spec") setSpecs([...syncDataList[target]]);
            else if (target === "personality") setPersonailies([...syncDataList[target]]);
            frameNode.setAttribute("data-cnt", syncDataStatus.cnt);
            frameNode.setAttribute("data-lastid", syncDataStatus.lastid);
            frameNode.setAttribute("data-updatedt", syncDataStatus.update_dt);
        }
    }
}
