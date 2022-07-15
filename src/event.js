import { updateQueue } from "./component";
/**
 * 事件委托，把所有的事件都绑定到document上
 * @param {*} dom
 * @param {*} eventType
 * @param {*} handler
 */

function addEvent(dom, eventType, handler) {
  let store; // 这是个对象,里面存放着此DOM上对应的事件处理函数
  // store是原生dom上的一个属性
  if (dom.store) {
    store = dom.store;
  } else {
    dom.store = {};
    store = dom.store;
  }
  store[eventType] = handler;
  if (!document[eventType]) {
    // 如果有很多个元素都绑定click事件，往document上只挂一次
    document[eventType] = dispatchEvent;
  }
}

function dispatchEvent(event) {
  let { target, type } = event;
  let eventType = `on${type}`;
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  // 模拟事件冒泡过程
  while (target) {
    let { store } = target;
    let handler = store && store[eventType];
    handler && handler.call(target, syntheticEvent);
    target = target.parentNode;
  }
  updateQueue.isBatchingUpdate = false;
  updateQueue.batchUpdate();
}

// 在源码里此处做了一些兼容性的适配
function createSyntheticEvent(event) {
  let syntheticEvent = {};
  for (let key in event) {
    syntheticEvent[key] = event;
  }
  return syntheticEvent;
}

export default addEvent;
