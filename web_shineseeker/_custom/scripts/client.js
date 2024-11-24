import {devLog} from "./common";
export {updateDataWithFormInputs, getImageUrl, getImageUrlAsync, cookieFetch, getDomIndex, checkHangulEncode, copyToClipBoard, clickCopyToClipBoard, alertModal};
/**
 *
 * @param {*} event
 * @param {*} apitype
 * @param {*} url
 * @param {*} addObjectData
 * @param {*} useFileId
 * @returns
 */
function updateDataWithFormInputs(event, apitype, url, addObjectData = {}, useFileId = false, isFileDataCheck = true) {
  if (!apitype || !url) {
    console.log("updateData : apitype or url is not defined", apitype, url);
    return false;
  }
  try {
    const formData = new FormData();
    formData.append("apitype", apitype);
    const inputs = event.target.querySelectorAll("input");

    inputs.forEach((inputNode) => {
      if (inputNode.type === "file") {
        // devLog("client.js updateDataWithFormInputs : handleSubmitUser ", inputNode, inputNode.files, isFileDataCheck, formData);
        if (inputNode?.files.length) {
          Array.from(inputNode.files).forEach((file) => {
            if (useFileId) formData.append(inputNode.id, file);
            else formData.append("file", file);
          });
        } else if (!isFileDataCheck) {
          formData.append(inputNode.id, null); // 파일이 없을경우에도 보내고 싶을 경우 null값으로 넣어준다
          devLog("client.js updateDataWithFormInputs : handleSubmitUser isFileDataCheck false", isFileDataCheck, formData);
        }
      } else {
        formData.append(inputNode.id, inputNode.value);
      }
    });
    // 추가데이터가 있을경우 추가해준다
    if (Object.keys(addObjectData).length > 0) {
      for (const key in addObjectData) formData.append(key, addObjectData[key]);
    }
    console.info("updateDataWithFormInputs : ", apitype, url, formData);
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

// 이미지 URL 변환 함수
function getImageUrl(src) {
  // src가 http:// 또는 https:// 로 시작하는지 확인
  if (/^https?:\/\//.test(src) || /^\/api\/image(\?)?src=/.test(src) || src == "init") {
    // devLog("client.js : getImageUrl src : ", src, /^\/api\/image(\?)?src=/.test(src));
    return src; // URL 그대로 반환
  } else if (src) {
    // devLog("client.js : getImageUrl Change : ", src, /^\/api\/image(\?)?src=/.test(src));
    return `/api/image?src=${src}`;
  }
  return null;
}
// 이미지 URL 변환 함수
async function getImageUrlAsync(src) {
  // src가 http:// 또는 https:// 로 시작하는지 확인
  if (/^https?:\/\//.test(src) || /^\/_next\/image?/.test(src)) {
    return src; // URL 그대로 반환
  } else if (src) {
    await fetch(`/api/image/check?src=${src}`)
      .then((res) => res.json())
      .then((data) => {
        src = data;
      });
    return src.src;
  }
  return null;
}

async function cookieFetch(url, token = null, method = "GET", data = null) {
  const options = {method: method};
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    options.headers = headers;
  } else {
    options.credentials = "include";
  }

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  // fetch를 await하지 않고 반환
  return fetch(url, options);
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
