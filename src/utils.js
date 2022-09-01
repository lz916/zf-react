import { REACT_TEXT } from "./constants";

/**
 * 不管原来是什么样的元素，都转成对象的形式，方便后续DOM-DIFF
 * @param {*} element
 * @returns
 */
export function wrapToVdom(element) {
  console.log("element", element);
  if (typeof element === "string" || element === "number") {
    return {
      type: REACT_TEXT,
      props: {
        content: element,
      },
    };
  } else {
    return element;
  }
}
