// 获取时间状态
export const getTimeState = () => {
  // 获取当前时间
  const timeNow = new Date();
  // 获取当前小时
  const hours = timeNow.getHours();
  // 设置默认文字
  let text = ``;
  // 判断当前时间段
  if (hours >= 0 && hours <= 10) {
    text = `早上好`;
  } else if (hours > 10 && hours <= 14) {
    text = `中午好`;
  } else if (hours > 14 && hours <= 18) {
    text = `下午好`;
  } else if (hours > 18 && hours <= 24) {
    text = `晚上好`;
  }
  // 返回当前时间段对应的状态
  return text;
};

// 定义一个节流函数
export function throttled(fn: Function, delay: number) {
  let timer: any = null;
  let starttime = Date.now();
  return function () {
    let curTime = Date.now(); // 当前时间
    let remaining = delay - (curTime - starttime); // 从上一次到现在，还剩下多少多余时间
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(context, args);
      starttime = Date.now();
    } else {
      timer = setTimeout(fn, remaining);
    }
  };
}

/**
 * @description 节流函数
 * @param func 回调
 * @param wait 等到时间
 * @param immediate 是否第一次就触发一次
 * @returns
 */
export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: any;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout); // timeout 不为null
    if (immediate) {
      let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * @description 获取访问终端
 * @example getTerminal()
 * @returns {string} 返回终端类型 mobile pc
 */
export function getTerminal() {
  const terminal = navigator.userAgent.toLowerCase();

  const ipad = terminal.match(/ipad/i);
  const iphone_os = terminal.match(/iphone os/i);
  const midp = terminal.match(/midp/i);
  const uc7 = terminal.match(/rv:1.2.3.4/i);
  const ucweb = terminal.match(/ucweb/i);
  const android = terminal.match(/android/i);
  const windows_ce = terminal.match(/windows ce/i);
  const windows_mobile = terminal.match(/windows mobile/i);

  if (
      (ipad && ipad[0] === "ipad") ||
      (iphone_os && iphone_os[0] === "iphone os") ||
      (midp && midp[0] === "midp") ||
      (uc7 && uc7[0] === "rv:1.2.3.4") ||
      (ucweb && ucweb[0] === "ucweb") ||
      (android && android[0] === "android") ||
      (windows_ce && windows_ce[0] === "windows ce") ||
      (windows_mobile && windows_mobile[0] === "windows mobile")
  ) {
    // 移动端浏览器
    return "mobile";
  } else {
    // PC端浏览器
    return "pc";
  }
}

/**
 * @description setTimeoutPromise 封装setTimeout为Promise 用法：await setTimeoutPromise(1000) 1秒后执行 resolve 然后执行后面的代码
 * @param time
 * @returns
 */
export function setTimeoutPromise(time: number) {
  return new Promise<void>((resolve) => {
    let timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, time);
  });
}
