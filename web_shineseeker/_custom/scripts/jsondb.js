import fs from "fs";
import path from "path";
const dev = process.env.NEXT_PUBLIC_DEV || "false";
let devLog = (...msg) => {
  if (dev == "true" || dev == "dev") {
    console.log("############### dev Log : " + dev + " ###############\n", ...msg);
  }
};
// 데이터를 저장할때 해당 키값 하위로 데이터를 넣어주고 마지막에 updated 시간을 넣어주는 함수
const updateDataObject = (object, key, data) => {
  if (!object?.[key]) object[key] = {};
  for (const [k, v] of Object.entries(data)) object[key][k] = v;
  object[key]["updated"] = Date.now();
  return object;
};

// 데이터 파일 경로
// const tempDir = path.join(process.cwd(), "public", "temp");
const tempDir = path.join("public/temp"); // vercel에서 process.cwd()는 /var/task로 인식해버림
const filePath = path.join(tempDir, "data.db");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, {recursive: true});

// 파일의 모든 줄을 읽는 함수
const readAllLines = () => {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent.split("\n");
  }
  return [];
};

// 첫 번째 줄(인덱스)을 읽는 함수
const readIndex = (lines = undefined) => {
  if (fs.existsSync(filePath)) {
    if (!lines) lines = readAllLines();
    return lines[0] ? JSON.parse(lines[0]) : {}; // 첫 줄이 인덱스
  }
  return {};
};
// 인덱스 업데이트 함수
const updateIndex = (index, lines = []) => {
  if (lines) lines[0] = JSON.stringify(index);
  else throw new Error("===== jsondb updateIndex : lines is undefined");
  // fs.writeFileSync(filePath, lines.join("\n"), "utf8");
  return lines;
};

// 인덱스 삭제 함수. 삭제할 경우 모든 키에 대한 인덱스 재갱신 필요
const deleteIndex = (key, lines = []) => {
  if (!lines) lines = readAllLines();
  let index = readIndex(lines);
  delete index[key];
  for (let k of Object.keys(index)) {
    // `k`에 해당하는 객체의 인덱스를 `lines`에서 찾아 반환
    let lineIndex = lines.findIndex((line) => line.hasOwnProperty(k));

    if (lineIndex !== -1) {
      index[k] = lineIndex;
      devLog(`Key: ${k} is found at line index: ${lineIndex}`);
    }
  }
  lines[0] = JSON.stringify(index);
  return lines;
};

// 특정 줄의 데이터를 읽는 함수
const readLine = (lineNumber) => {
  const lines = readAllLines();
  return lines[lineNumber] ? JSON.parse(lines[lineNumber]) : null;
};

// 특정 줄의 데이터를 수정하는 함수
const updateLine = (key, lineNumber, data) => {
  const lines = readAllLines();
  let updateLines = updateDataObject(JSON.parse(lines[lineNumber]), key, data);
  lines[lineNumber] = JSON.stringify(updateLines);
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
};

// 특정 줄의 데이터를 삭제하는 함수
const deleteLine = (lineNumber, lines = undefined) => {
  if (!lines) lines = readAllLines();
  lines.splice(lineNumber, 1);
  return lines;
};

// 새로운 객체 추가 및 인덱스 업데이트 함수
const addNewObject = (key, data) => {
  let lines = readAllLines();
  let newLineNumber = lines.length;
  let index = {};
  if (!newLineNumber) {
    index[key] = 1;
    lines = updateIndex(index, lines);
  } else {
    index = readIndex();
    index[key] = newLineNumber;
    lines = updateIndex(index, lines);
  }

  let addData = updateDataObject({}, key, data);
  lines.push(JSON.stringify(addData));
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
};

/**
 * 객체 읽기 함수. timesecgap 값이 존재할 경우 해당 시간 이내에 수정된 객체만 반환
 * timegap is second
 * @param {*} key
 * @param {int} timeSecondgap
 * @returns
 */
const readObject = (key, timeSecondgap = 0) => {
  try {
    const index = readIndex();
    const lineNumber = index[key];
    let lines = {};
    if (lineNumber !== undefined) lines = readLine(lineNumber)[key];
    // devLog("jsondb readObject key : ", key, lineNumber);

    if (timeSecondgap) {
      timeSecondgap = 1000 * timeSecondgap;
      // devLog("jsondb readObject timeSecondgap : ", timeSecondgap, lines?.updated > Date.now() - timeSecondgap ? "o" : "x", lines?.updated, Date.now() - timeSecondgap);
      if (lines?.updated > Date.now() - timeSecondgap) {
        devLog(`jsondb readObject timeSecondgap inner ${timeSecondgap}`);
        return lines;
      } else return null;
    }
    return lines;
  } catch (e) {
    console.error("jsondb readObject Function : ", e);
    return null;
  }
};

// 객체 수정 함수
const updateObject = (key, newData) => {
  try {
    const index = readIndex();
    const lineNumber = index?.[key];
    devLog("jsondb updateObject parameter : ", key, newData, lineNumber);
    if (lineNumber) {
      updateLine(key, lineNumber, newData);
    } else {
      addNewObject(key, newData);
    }
  } catch (e) {
    console.error("jsondb updateObject Function : ", e);
    return false;
  }
  return true;
};

// 객체 삭제 함수
const deleteObject = (key) => {
  let lines = readAllLines();
  const index = readIndex(lines);
  const lineNumber = index[key];

  if (lineNumber !== undefined) {
    lines = deleteLine(lineNumber);
    lines = deleteIndex(key, lines);
    fs.writeFileSync(filePath, lines.join("\n"), "utf8");
  } else {
    console.error(`Object with key "${key}" not found`);
  }
};

const jsondb = {
  readObject,
  updateObject,
  deleteObject,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = jsondb;
}
export default jsondb;
/* 사용 예제
  const exampleData = { data: 'name' };

  // 객체 추가 또는 수정
  updateObject('test', exampleData);

  // 객체 읽기
  console.log(readObject('test')); // { data: 'name' }

  // 객체 수정
  const updatedData = { data: 'name2' };
  updateObject('test', updatedData);
  console.log(readObject('test')); // { data: 'name2' }

  // 객체 삭제
  deleteObject('test');
  console.log(readObject('test')); // null
*/
