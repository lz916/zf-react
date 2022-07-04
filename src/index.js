import ReactDOM from "./react-dom";
import React from "./react";

/**
 * JSX其实是React的语法糖（javascript+xml html）
 */
// let element = <h1>hello</h1>;
// 讲过babel转义后
let element = React.createElement("div", null, "hello");

// 所谓的渲染就是按照react元素所描述的结构，创建真实DOM元素，并插入root容器内
// 会有ReactDOM来确保浏览器的真实DOM和虚拟DOM一致
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
