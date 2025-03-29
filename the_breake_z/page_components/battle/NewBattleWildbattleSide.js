/* next Module */
import {useEffect, useState, useRef, useContext} from "react";
import GridInputTextArea from "/page_components/Grid/GridInputTextArea";
import GridInputButton from "/page_components/Grid/GridInputButton";
import {getRandomInt, asyncInterval, devLog} from "/scripts/common";

let host = process.env.NEXT_PUBLIC_HOST || "";

export default function Layout(props) {
  const [sideText, setSideText] = useState("");

  async function getSideText() {
    let baseurl = host + "/api/data";

    let res = await fetch(baseurl, {
      method: "POST",
      body: JSON.stringify({tableName: "side", query: "one"}),
    });
    let json = await res.json();
    if (json.length) setSideText(json[0].TEXT);

    devLog("side : ", json);
  }

  async function saveSide() {
    let inputNode = document.querySelector("#battle-side-text");
    if (!inputNode) return;

    let sendData = new FormData();
    sendData.append("name", "battle");
    sendData.append("text", inputNode.value);

    let baseurl = host + "/api/upload/side";
    let res = await fetch(baseurl, {
      method: "POST",
      body: sendData,
    });
  }

  useEffect(() => {
    getSideText();
  }, []);

  return (
    <>
      <div className={"grid grid-cols-6 gap-2"}>
        <GridInputTextArea id={`battle-side-text`} css={"max-h-screen"} maxHeight={600} default={sideText} />
        <GridInputButton label={"저장"} type="button" onclick={saveSide} colSpan={6}></GridInputButton>
      </div>
    </>
  );
}
