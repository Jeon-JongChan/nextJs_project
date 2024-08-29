import fs from "fs";
import path from "path";
let dev = process.env.NEXT_PUBLIC_DEV || true;
let devLog = (...msg) => {
  if (dev) {
    console.log(...msg);
  }
};
// 데이터 파일 경로
const tempDir = path.join(process.cwd(), "public", "temp");
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
const readIndex = () => {
  if (fs.existsSync(filePath)) {
    const lines = readAllLines();
    return lines[0] ? JSON.parse(lines[0]) : {}; // 첫 줄이 인덱스
  }
  return {};
};

// 특정 줄의 데이터를 읽는 함수
const readLine = (lineNumber) => {
  const lines = readAllLines();
  return lines[lineNumber] ? JSON.parse(lines[lineNumber]) : null;
};

// 특정 줄의 데이터를 수정하는 함수
const updateLine = (key, lineNumber, data) => {
  const lines = readAllLines();
  let updateLines = JSON.parse(lines[lineNumber]);
  for (const [k, v] of Object.entries(data)) updateLines[key][k] = v;
  lines[lineNumber] = JSON.stringify(updateLines);
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
};

// 특정 줄의 데이터를 삭제하는 함수
const deleteLine = (lineNumber) => {
  const lines = readAllLines();
  lines.splice(lineNumber, 1);
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
};

// 인덱스 업데이트 함수
const updateIndex = (index, lines = []) => {
  if (lines) lines[0] = JSON.stringify(index);
  else console.error("jsondb updateIndex failed");

  // fs.writeFileSync(filePath, lines.join("\n"), "utf8");
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

  let addData = {};
  addData[key] = {};
  for (const [k, v] of Object.entries(data)) addData[key][k] = v;
  lines.push(JSON.stringify(addData));
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
};

// 객체 읽기 함수
const readObject = (key) => {
  const index = readIndex();
  const lineNumber = index[key];
  return lineNumber !== undefined ? readLine(lineNumber) : {};
};

// 객체 수정 함수
const updateObject = (key, newData) => {
  try {
    const index = readIndex();
    const lineNumber = index?.[key];
    console.log("===== jsondb updateObject =====\n", key, newData, lineNumber);
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
  const index = readIndex();
  const lineNumber = index[key];

  if (lineNumber !== undefined) {
    deleteLine(lineNumber);
    delete index[key];
    updateIndex(index);
  } else {
    console.log(`Object with key "${key}" not found`);
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
