import { REACT_TEXT } from "./constants";

const render = (vdom, container) => {
  const dom = createDOM(vdom);
  console.log(123);
  console.log(dom);
  container.appendChild(dom);
};

const createDOM = (vdom) => {
  const { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    dom = mountFunctionComponent(vdom);
  } else {
    dom = document.createElement(type);
  }
  return dom;
};

const mountFunctionComponent = (vdom) => {
  const { type, props } = vdom;
  const renderVdom = type(props);
  console.log(renderVdom);
  console.log("函数组件的真实dom");
  console.log(createDOM(renderVdom));
  return createDOM(renderVdom);
};

const ReactDOM = {
  render,
};

export default ReactDOM;
