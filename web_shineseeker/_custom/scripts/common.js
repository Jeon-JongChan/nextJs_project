// 반드시 서버 및 클라이언트에 모두 적용가능한 함수만 작성할 것
// 서버에서만 사용하는 함수는 server.js에 작성할 것
// 클라이언트에서만 사용하는 함수는 client.js에 작성할 것

export {devLog, asyncInterval, sleep, getRandomInt, getRandomValue, getDataIdx, getNameIdx, getTestImageUrl};
/**
 * sleep 함수 필요. 렉시컬 응용.
 * @param {*} fn 함수
 * @param {*} ms 반복 시간
 */
let dev = process.env.NEXT_PUBLIC_DEV || "false";
let devLog = (...msg) => {
  if (dev == "true" || dev == "dev") {
    console.info("############### dev Log ###############\n", ...msg);
  }
};

function sleep(ms) {
  let timer;
  return new Promise((resolve) => {
    clearTimeout(timer);
    timer = setTimeout(resolve, ms);
  });
}

/**
 * 최소값과 최대값을 받아 사이의 랜덤 정수값 반환 ( 최대값 미포함 )
 * @param {*} min
 * @param {*} max
 * @returns
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값도 미포함, 최솟값만 포함
}

function getRandomValue(values) {
  let idx = getRandomInt(0, values.length);
  return values[idx];
}
function getNameIdx(objArr, name) {
  for (let i = 0; i < objArr.length; i++) {
    if (objArr[i].name === name) {
      return i;
    }
  }
  return -1;
}
function getDataIdx(objArr, value, key = "name") {
  for (let i = 0; i < objArr.length; i++) {
    if (objArr[i][key] === value) {
      return i;
    }
  }
  return -1;
}

function getTestImageUrl(width, height, text = "TEST") {
  return `https://via.placeholder.com/${width}x${height}?text=${text}`;
}

class asyncInterval {
  constructor(fn, sec) {
    this.startCount = 0;
    this.fn = fn;
    this.sec = sec * 1000;
  }
  stop() {
    this.startCount = 0;
    // devLog("asyncInterval stop, current count", this.startCount);
  }
  async start(...args) {
    if (this.startCount > 0) {
      devLog("asyncInterval have many jobs - ", this.startCount);
      return;
    }
    this.stop();
    this.startCount += 1;
    // devLog("asyncInterval start current count : ", this.startCount);
    while (this.startCount > 0 && this.startCount <= 1) {
      await this.fn(...args);
      await sleep(this.sec);
    }
    devLog("asyncInterval exit current count : ", this.startCount);
    this.startCount -= 1;
  }
}
/*
// 함수형 asyncInterval
function asyncInterval(fn, sec) {
    sec = sec * 1000;
    let state = 0;
    function stop() {
        state = 0;
        devLog("asyncInterval stop state : ", state);
    }
    async function start(...arg) {
        devLog("asyncInterval start : ", fn);
        state += 1;
        while (state) {
            if (state > 1) {
                devLog("asyncInterval  overlap. counting : ", state, " reject function : ", fn);
                state -= 1;
                return;
            }
            await sleep(sec);
            await fn(...arg);
            // devLog("asyncInterval state : ", state);
        }
        state -= 1;
        devLog("asyncInterval exit");
    }
    return { start, stop };
}
*/
