import {devLog} from "./common";
export {updateDataWithFormInputs, getDomIndex, checkHangulEncode, copyToClipBoard, clickCopyToClipBoard, alertModal};
/**
 *
 * @param {*} event
 * @param {*} apitype
 * @param {*} url
 * @param {*} addObjectData
 * @param {*} useFileId
 * @returns
 */
function updateDataWithFormInputs(event, apitype, url, addObjectData = {}, useFileId = false) {
  if (!apitype || !url) {
    console.log("updateData : apitype or url is not defined", apitype, url);
    return false;
  }
  try {
    const formData = new FormData();
    formData.append("apitype", apitype);
    const inputs = event.target.querySelectorAll("input");

    inputs.forEach((inputNode) => {
      if (inputNode.type === "file" && inputNode?.files) {
        devLog("client.js updateDataWithFormInputs : handleSubmitUser ", inputNode, inputNode.files);
        Array.from(inputNode.files).forEach((file) => {
          if (useFileId) formData.append(inputNode.id, file);
          else formData.append("file", file);
        });
      } else {
        formData.append(inputNode.id, inputNode.value);
      }
    });
    // 추가데이터가 있을경우 추가해준다
    if (Object.keys(addObjectData).length > 0) {
      for (const key in addObjectData) formData.append(key, addObjectData[key]);
    }

    fetch("/api/" + url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  } catch (e) {
    console.error("client.js updateDataWithFormInputs : updateData error : ", e.message);
  }
  return true;
}

function getDomIndex(dom, elem = null) {
  if (!elem) elem = dom.parentNode;
  var idx = null;
  for (var i = 1; i < elem.childNodes.length; i++) {
    if (elem.childNodes[i] === dom) {
      //devLog(elem, elem.childNodes[i],dom,'elemIndex = ', i);
      idx = i;
      break;
    }
  }
  return idx;
}

const checkHangulEncode = (keyword) => {
  const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식

  if (keyword.match(check_kor)) {
    const encodeKeyword = encodeURI(keyword); // 한글 인코딩
    return encodeKeyword;
  } else {
    return keyword;
  }
};
function copyToClipBoard(query) {
  var node = document.querySelector(query);
  var content = node?.innerText;

  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        alertModal("텍스트만 복사되었습니다.");
        devLog("Text copied to clipboard...");
      })
      .catch((err) => {
        devLog("Something went wrong", err);
      });
  } else {
    unsecuredCopyToClipboard(content);
  }
}
function clickCopyToClipBoard(e) {
  var node = e.target;
  var content = node?.innerText;

  try {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        alertModal("텍스트만 복사되었습니다.");
        devLog("Text copied to clipboard...");
      });
    } else {
      unsecuredCopyToClipboard(content);
    }
  } catch (e) {
    devLog("clickCopyToClipBoard error : ", e.message);
  }
}
function unsecuredCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  // textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    alertModal("텍스트 복사되었습니다.");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
}
function alertModal(msg) {
  if (!msg) return;
  let modal = document.querySelector("#alert-modal");
  // devLog("alertModal modal : ", modal);
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "alert-modal";
    modal.style.cssText = `
            position: fixed;
            background-color: wheat;
            padding: 1rem;
            top: 1rem;
            border-radius: 0.75rem;
            opacity: 0.9;
            font-weight: 700;
            display: none;
        `;
    document.querySelector("body").appendChild(modal);
    modal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  modal.innerText = msg;
  modal.style.display = "block";
  setTimeout(() => {
    modal.style.display = "none";
  }, 1000);
}
