import { REACT_TEXT } from "./constants";

const render = (vdom, container) => {
  const dom = createDOM(vdom);
  container.appendChild(dom);
};

const createDOM = (vdom) => {
  const { type, props } = vdom;
  console.log("props");
  console.log(props);
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    dom = mountFunctionComponent(vdom);
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
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    }
    dom[key] = newProps[key];
  }
};

const mountFunctionComponent = (vdom) => {
  const { type, props } = vdom;
  const renderVdom = type(props);
  return createDOM(renderVdom);
};

const ReactDOM = {
  render,
};

export default ReactDOM;
