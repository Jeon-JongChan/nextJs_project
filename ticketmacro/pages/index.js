import GridInputText from "/page_components/Grid/GridInputText";
import GridBorderBox from "/page_components/Grid/GridBorderBox";
import GridInputButton from "/page_components/Grid/GridInputButton";
import ListItem from "/page_components/public/ListItem";
import {useEffect, useState, useRef} from "react";
import {devLog} from "/scripts/common";
import {sseConnect} from "/scripts/client/sseClient";

export default function Home() {
    const intervalRef = useRef([]);
    const [macroList, setMacroList] = useState([]);

    let source;
    let userName = "test";
    useEffect(() => {
        intervalRef.current.push(setInterval(listMacro, 10 * 1000));
        source = sseConnect(userName);
        source.addEventListener("message", (event) => {
            devLog(`Progress: ${event.data}`);
            logMacro(event.data);
        });

        return () => {
            devLog("useEffect Close");
            intervalRef.current.map((interval) => clearInterval(interval));
            intervalRef.current = [];
            source.close();
        };
    }, []);

    // prettier-ignore
    let defaultDate = new Intl.DateTimeFormat("ko-KR", {year: "numeric", month: "2-digit", day: "2-digit"}).format(new Date()).replace(/\./g, "").replace(/ /g, "-");
    // prettier-ignore
    let defaultTime = new Intl.DateTimeFormat("en", {hour: "numeric", minute: "numeric", second: "numeric", hour12: false}).format(new Date().getTime()-5*60000);

    function handleSSE(event) {
        console.log("SSE", event.data);
    }

    function submitMacroData() {
        let inputList = ["url", "seat", "date", "time", "ticketdate"];
        let inputValues = {};
        // input에서 value를 가져온다.
        for (let i = 0; i < inputList.length; i++) {
            let value = document.querySelector("#macro-" + inputList[i])?.value;
            if (!value) value = "";
            inputValues[inputList[i]] = value;
        }
        if (inputValues.address == "") {
            alert("매크로를 원하는 사이트 URL은 필수입니다!");
            return;
        }

        // prettier-ignore
        fetch(`/api/macro/insert?id=${userName}`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
            site: "interpark",
            url: inputValues.url,
            seat: inputValues.seat,
            datetime: inputValues.date+' '+inputValues.time,
            ticketdate: inputValues.ticketdate,
            }),
        })
        .then(async (res) => {
          let data = await res.json();
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
    function logMacro(logMsg) {
        const logFrame = document.querySelector("#macro-log");
        let logLength = logFrame.children.length;
        let log = document.createElement("p");
        log.classList.add("bg-white", "px-2", "py-1");
        log.innerText = `${logLength}. ` + logMsg;
        logFrame.appendChild(log);
        logFrame.scrollTop = logFrame.scrollHeight;

        devLog("Function : logMacro - ", logMsg, source);
    }
    async function listMacro() {
        let res = await fetch(`/api/data?id=macro_list_all`);
        let data = await res.json();
        setMacroList([...data]);
        // console.log(intervalRef.current.length, " : listMacro", data);
    }
    return (
        <>
            <div className="flex">
                <div className="flex flex-col p-2 w-full lg:w-1/2">
                    <GridBorderBox
                        noteHeader={"매크로 입력 데이터"}
                        noteContent={"매크로를 원하는 사이트에 자동로그인은 필수입니다!"}
                        propComponents={[GridInputText, GridInputText, GridInputText, GridInputText, GridInputText, GridInputText, GridInputButton]}
                        propComponentsProperty={[
                            {id: "macro-url", label: "티켓팅 URL", smallLabel: "필수데이터"},
                            {colSpan: 2, id: "macro-seat", label: "좌석", smallLabel: "없으면 앞 순서 랜덤", type: "number", inputId: "macro-seat"},
                            {colSpan: 2, id: "macro-date", label: "매크로 시작일", type: "date", default: defaultDate},
                            {colSpan: 2, id: "macro-time", label: "매크로 시작시간", type: "time", default: defaultTime},
                            {colSpan: 2, id: "macro-ticketdate", label: "티켓예매일", type: "date", default: defaultDate},
                            {id: "macro-text", label: "여유텍스트"},
                            {id: "button-macro-submit", label: "제출", onclick: submitMacroData},
                        ]}
                    ></GridBorderBox>
                </div>
                <div className="flex flex-col p-2 w-full lg:w-1/2">
                    <div className="px-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">매크로 로그</h3>
                    </div>
                    <div id="macro-log" className="overflow-y-scroll scrollbar-remove" style={{height: "320px"}}></div>
                </div>
            </div>
            <div className="flex flex-col p-2 ">
                {macroList.map((data, index) => {
                    return (
                        <div className="grid grid-cols-6 w-full max-h-64 overflow-y-scroll scrollbar-remove border rounded-md p-2" key={index}>
                            <span className="col-span-1">대상사이트 : {data.SITE} &nbsp;</span>
                            <span className="col-span-3">URL : {data.URL}</span>
                            <span className="col-span-2">매크로시작시간 : {data.START_DT}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
