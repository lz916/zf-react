import { REACT_TEXT } from "./constants";
import addEvent from "./event";
import { REACT_FORWARD_REF_TYPE } from "./constants";
/**
 * 把虚拟DOM转成真是DOM插入到容器中
 * @param {} vdom
 * @param {*} container
 */

function render(vdom, container) {
  const newDom = createDom(vdom);
  container.appendChild(newDom);
  if (newDom.componentDidMount) newDom.componentDidMount();
}

function createDom(vdom) {
  let { props, type, ref } = vdom;
  let dom;
  if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    return mountForwardComponent(vdom);
  }
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      dom = mountClassComponent(vdom);
    } else {
      dom = mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children === "object" && props.children.type) {
      // 是一个对象且自有一个儿子
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      // 是一个数组
      reconcileChildren(props.children, dom);
    }
  }
  // 让虚拟DOM的dom属性指向它的真实DOM
  if (ref) {
    ref.current = dom;
  }
  vdom.dom = dom;
  return dom;
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let childVdom = childrenVdom[i];
    render(childVdom, parentDOM);
  }
}

function mountClassComponent(vdom) {
  let { type, props, ref } = vdom;
  let defaultProps = type.defaultProps;
  let componentProps = { ...defaultProps, ...props };
  const classInstance = new type(componentProps);
  vdom.classInstance = classInstance;
  if (classInstance.componentWillMount) classInstance.componentWillMount();
  let renderVdom = classInstance.render();
  if (classInstance.componentDidMount) classInstance.componentDidMount();
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  if (ref) ref.current = classInstance;
  let dom = createDom(renderVdom);
  // 暂时把didMount方法暂存到dom上
  if (classInstance.componentDidMount)
    dom.componentDidMount = classInstance.componentDidMount.bind(this);
  return dom;
}
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;

  let renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom;
  return createDom(renderVdom);
}

function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDom(renderVdom);
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    // console.log(`key:${key}`);
    if (key === "children") {
      continue;
    }
    if (key === "style") {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      // onClick 绑定事件
      // dom[key.toLocaleLowerCase()] = newProps[key];
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}

/**
 * 根据vdom返回真实DOM
 * @param {*} vdom
 */

export const findDOM = (vdom) => {
  const { type } = vdom;
  let dom;
  if (typeof type === "function") {
    dom = findDOM(vdom.oldRenderVdom);
  } else {
    dom = vdom.dom;
  }
  return dom;
};
/**
 * 比较新旧的虚拟dom，找出差异，更新到真实dom上
 * 现在还没实现dom-diff
 * @param {*} parentDOM
 * @param {*} oldVdom
 * @param {*} newVdom
 */

export const compareTowVdom = (parentDOM, oldVdom, newVdom, nextDOM) => {
  let oldDOM = findDOM(oldVdom);
  let newDOM = createDom(newVdom);
  parentDOM.reconcileChildren(newDOM, oldDOM);
  if (!oldVdom && !newVdom) {
    // 如果老的虚拟dom是null,新的虚拟也是null
    return null;
  } else if (oldVdom && !newVdom) {
    // 老的不为null，新的为null，销毁老组件
    let currentDOM = findDOM(oldVdom);
    currentDOM.parentNode.removeChild(currentDOM); // 把老的真实删除
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount(); // 类组件 执行组件卸载方法
    }
  } else if (!oldVdom && newVdom) {
    // 如果老的没有，新的有，久根据新的组件创建新的DOM并且添加到父DOM容器中
    let newDOM = createDom(newVdom);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);
    }
    parentDOM.appendChild(newDOM); // TODO 此处可能是插入当前的位置，insertBefore?
    if (newDOM.componentDidMount) newDOM.componentDidMount();
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    // 新老都有类型不同
    let oldDOM = findDOM(oldVdom);
    let newDOM = createDom(newVdom);
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount(); // 类组件 执行组件卸载方法
      if (newDOM.componentDidMount) newDOM.componentDidMount();
    } else {
      // 老的有，新的有，类型也一样，需要复用老节点，进行深度的递归 dom diff
      updateElement(oldVdom, newVdom);
      return newVdom;
    }
  }
  // const { type } = vdom;
  // let dom;
  // if (typeof type === "function") {
  //   dom = findDOM(vdom.oldRenderVdom);
  // } else {
  //   dom = vdom.dom;
  // }
  // return dom;
};

function updateElement(oldVdom, newVdom) {
  // 文本节点的更新
  if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    if (oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content;
    }
  } else if (typeof oldVdom.type === "string") {
    // 让新的虚拟DOM的真实DOM属性等于老的虚拟DOM对应的哪个真实DOM
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    // 用新的属性更新DOM的老属性
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance);
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
  // 因为此更新是由于父组件更新引起的，父组件在重新渲染的瘦，给子组件传递新的属性
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVDom) {
  let parentDOM = findDOM(oldVdom).parentDOM;
  let { type, props } = newVDom;
  let renderVdom = type(props);
  newVDom.oldRenderVdom = renderVdom;
  compareTowVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    // 找当前虚拟DOM节点后的最近的一个真实DOM
    let nextVNode = oldVChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    compareTowVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextVNode && findDOM(nextVNode)
    );
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
