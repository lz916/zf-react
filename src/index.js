import ReactDOM from "./react-dom1";
import React from "./react1";

/**
 * JSX其实是React的语法糖（javascript+xml html）
 */
// let element = <h1>hello</h1>;
// 讲过babel转义后
// let element = React.createElement("div", null, "hello");

// 函数组件其实是一个函数，接受props，返回一个React元素
function FunctionComponent(props) {
  return <h1>hello, {props.name}</h1>;
  //   return React.createElement("div", null, "hello,", props.name);
}

let element = React.createElement(FunctionComponent, { name: "lz" });
console.log(element);

// 所谓的渲染就是按照react元素所描述的结构，创建真实DOM元素，并插入root容器内
// // 会有ReactDOM来确保浏览器的真实DOM和虚拟DOM一致
// ReactDOM.render(element, document.getElementById("root"));
debugger;
ReactDOM.render(element, document.getElementById("root"));

/** 虚拟dom
 * {
    "type": "h1",
    "key": null,
    "ref": null,
    "props": {
        "children": "hello"
    },
    "_owner": null,
    "_store": {}
}
*/
