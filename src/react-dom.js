import { REACT_TEXT } from "./constants";
import addEvent  from "./event";
/**
 * 把虚拟DOM转成真是DOM插入到容器中
 * @param {} vdom
 * @param {*} container
 */

function render(vdom, container) {
  const newDom = createDom(vdom);
  container.appendChild(newDom);
}

function createDom(vdom) {
  let { props, type } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      mountClassComponent(vdom);
    } else {
      mountFunctionComponent(vdom);
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
  let { type, props } = vdom;
  const classInstance = new type(props);
  let renderVdom = classInstance.render();
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  return createDom(renderVdom);
}
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;

  let renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom;
  return createDom(renderVdom);
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    console.log(`key:${key}`);
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
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])

    } else {
      dom[key] = newProps?.[key];
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

export const compareTowVdom = (parentDOM, oldVdom, newVdom) => {
  let oldDOM= findDOM(oldVdom)
  let newDOM = createDom(newVdom)
  parentDOM.reconcileChildren(newDOM, oldDOM)
  // const { type } = vdom;
  // let dom;
  // if (typeof type === "function") {
  //   dom = findDOM(vdom.oldRenderVdom);
  // } else {
  //   dom = vdom.dom;
  // }
  // return dom;
};

const ReactDOM = {
  render,
};

export default ReactDOM;
