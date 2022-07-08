import { REACT_TEXT } from "./constants";
/**
 * 把虚拟DOM转成真是DOM插入到容器中
 * @param {} vdom
 * @param {*} container
 */

function render(vdom, container) {
  debugger;
  console.log(vdom);
  const newDom = createDom(vdom);

  container.appendChild(newDom);
}

function createDom(vdom) {
  let { props, type } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    mountFunctionComponent(vdom);
  } else {
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
  }
  if (typeof props.children === "object" && props.children.type) {
    // 是一个对象且自有一个儿子
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    // 是一个数组
    reconcileChildren(props.children, dom);
  }
  return dom;
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let childVdom = childrenVdom[i];
    render(childVdom, parentDOM);
  }
}

function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props);
  return createDom(renderVdom);
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    }
    if (key === "style") {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else {
      dom[key] = newProps[key];
    }
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
