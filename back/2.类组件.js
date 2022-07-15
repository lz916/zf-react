import ReactDOM from "./react-dom";
import React from "./react";

/**
 * 组件分为内置原生组件和自定义组件
 * 内置组件p h1 span type是一个字符串
 * 自定义组件类型是一个函数,雷组件的父类Component的原型上有一个属性isReactComponent={}
 * 自定义组件名称必须是大写开头
 * 自定义组件的返回值有且只有一个根元素
 */

class ClassComponent extends React.Component {
  render() {
    return (
      <h1 style={{ color: "red" }}>
        <span>hello</span>
        {this.props.name}
      </h1>
    );
  }
}

function FunctionComponent(props) {
  return (
    <h1 style={{ color: "red" }}>
      <span>hello</span>
      {this.props.name}
    </h1>
  );
}

const element1 = <ClassComponent name="lz" />;
const element2 = <FunctionComponent name="lz" />;
console.log(element1);
console.log(element2);

ReactDOM.render(
  <ClassComponent name={"lz"} />,
  document.getElementById("root")
);
