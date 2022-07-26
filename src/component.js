import { findDOM, compareTowVdom } from "./react-dom";
export let updateQueue = {
  isBatchingUpdate: false, // 通过此变量来控制是否批量更新
  updaters: [],
  batchUpdate() {
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate = false;
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = []; // 保存将要更新得队列
    this.callbacks = []; // 保存将要执行得回调函数
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState);
    if (typeof callback === "function") {
      this.callbacks.push(callback);
      this.emitUpdate(); // 触发更新逻辑
    }
  }
  // 不管状态变化和属性变化 都会让组件刷新，都会执行此方法
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent();
    }
  }
  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState());
    }
  }
  // 根据老状态和队列计算新状态
  getState() {
    let { classInstance, pendingStates, callbacks } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    callbacks.forEach((callback) => callback());
    this.pendingStates.length = 0; // 清空等待更新得队列
    this.callbacks.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true; // 是否要更新，默认值是true
  if (
    // 有此方法并且值为false
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }
  // 不管要不要更新，属性和状态都要更新为最新的
  if (nextProps) classInstance.props = nextProps
  classInstance.state = nextProps
  classInstance.state = nextState; // 真正修改实列的状态
  classInstance.forceUpdate(); // 然后调用类组件的updateComponent方法进行更新
}

class Component {
  static isReactComponent = {};
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每一个类组件的实例有一个updater更新器
    this.updater = new Updater(this);
  }
  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }
  /**
   * 组件时如何更新得
   * 1. 获取 老的虚拟dom react元素
   * 2. 根据最新的属性和状态计算新的虚拟dom
   * 3. 然后进行比较，查找差异，然后把这些差异同步到真实DOM上
   */
  forceUpdate() {
    console.log("updateComponent");
    let oldRenderVdom = this.oldRenderVdom;
    // 根据老的虚拟dom查到老的真实DOM
    let oldDOM = findDOM(oldRenderVdom);
    let newRenderVdom = this.render();
    compareTowVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state)
    }
  }
}

export default Component;
