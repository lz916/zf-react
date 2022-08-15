import { wrapToVdom } from "./utils";
import Component from "./component";
function createElement(type, config, children) {
  let key;
  let ref;
  if (config) {
    delete config._self;
    delete config._source;
    key = config.key;
    delete config.key;
    ref = config.ref;
    delete config.ref;
  }
  const props = { ...config };
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // children可能是一个字符串，也可能是一个数字，也可能是个null或者undefiend,也可能是一个对象
    props.children = wrapToVdom(children);
  }
  return {
    type,
    props,
    key,
    ref,
  };
}

const React = {
  createElement,
  Component,
};

export default React;
