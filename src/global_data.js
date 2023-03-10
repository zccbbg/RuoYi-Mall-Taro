import Taro from "@tarojs/taro";

const globalData = {}
let timer;
function persistence() {
  clearTimeout(timer);
  setTimeout(() => {
    Taro.setStorageSync('globalData', globalData);
  }, 200)
}

function initState() {
  const objs = Taro.getStorageSync('globalData');
  Object.keys(objs).forEach(k => {
    globalData[k] = objs[k];
  })
}
initState();
export function set(key, val) {
  globalData[key] = val
  persistence();
}

export function get(key) {
  return globalData[key]
}
export function removeGlobalByKey(key) {
  delete globalData[key];
}
