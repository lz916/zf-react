import { REACT_TEXT } from "./constants";
import Component from "./component1";

const render = (vdom, container) => {
  const dom = createDOM(vdom);
  container.appendChild(dom);
};

const createDOM = (vdom) => {
  const { type, props } = vdom;
  let dom;
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
      // 是一个对象且只有一个儿子
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  return dom;
};

const reconcileChildren = (childrenVdom, parentDOM) => {
  for (let i = 0; i < childrenVdom.length; i++) {
    render(childrenVdom[i], parentDOM);
  }
};

const updateProps = (dom, oldProps, newProps) => {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    }
    if (key === "style") {
      let styleObj = newProps[key];
      console.log(styleObj);
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else {
      dom[key] = newProps[key];
    }
  }
};

const mountFunctionComponent = (vdom) => {
  const { type, props } = vdom;
  const renderVdom = type(props);
  return createDOM(renderVdom);
};

const mountClassComponent = (vdom) => {
  const { props, type } = vdom;
  const classInstance = new type(props);
  const renderVdom = classInstance.render();
  const dom = createDOM(renderVdom);
  return dom;
};

const ReactDOM = {
  render,
  Component,
};

export default ReactDOM;
