import { wrapToVdom } from "./utils";
import Component from "./component";
/**
 * @param {*} type 类型
 * @param {*} config 配置对象
 * @param {*} children 第一个儿子
 *
 * @returns
 */

function createElement(type, config, children) {
  let props = { ...config };
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // children可能是一个字符串，也可能是一个数字，也可能是个null或者undefiend,也可能是一个对象
    props.children = wrapToVdom(children);
  }
  return {
    type,
    props,
  };
}

const React = {
  createElement,
  Component,
};

export default React;
