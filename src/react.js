import { wrapToVdom } from "./utils";
import Component from "./component";
import { REACT_FORWARD_REF_TYPE } from "./constants";
/**
 * @param {*} type 类型
 * @param {*} config 配置对象
 * @param {*} children 第一个儿子
 *
 * @returns
 */

function createElement(type, config, children) {
  console.log("type", type);
  let ref; // 用来获取虚拟DOM实例的
  let key; // 用来区分同一个父亲的不同儿子的
  if (config) {
    delete config._source;
    delete config._self;
    ref = config.ref;
    delete config.ref;
    key = config.key;
    delete config.key;
  }
  let props = { ...config }; // 没有ref和key的
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // children可能是一个字符串，也可能是一个数字，也可能是个null或者undefiend,也可能是一个对象
    props.children = wrapToVdom(children);
  }
  return {
    type,
    props,
    ref,
    key,
  };
}

function createRef() {
  return {
    current: null,
  };
}

function forwardRef(render) {
  // return class extends Component {
  //   render() {
  //     return FunctionComponent(this.props, this.props.ref);
  //   }
  // };
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
};

export default React;
