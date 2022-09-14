import element from "./element.js";
console.log("element11", element);

let container = document.getElementById("root");

// 下一个工作单元
// fiber其实也是要给普通得js对象
let nextUnitOfWork = {
  stateNode: container, // 此fiber对应得Dom节点
  props: {
    children: [element], // fiber属性
  },
};

let workingInProgress;

function workLoop(deadline) {
  // 如果有当前得工作单元，就执行它，并返回一个工作单元
  while (nextUnitOfWork) {
    console.log("nextUnitOfWork", nextUnitOfWork);
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    commitRoot();
  }
}

function commitRoot() {}
/**c
 * beginWork 1.创建此fiber的真实DOM 通过虚拟DOM创建fiber树结构
 * @param {*} workingInProgressFiber
 */
function performUnitOfWork(workingInProgressFiber) {
  console.log("workingInProgressFiber", workingInProgressFiber);
  // 1创建真实DOM，并没有挂载，2创建fiber子树
  beginWork(workingInProgressFiber);
  if (workingInProgressFiber.child) {
    return workingInProgressFiber.child; // 如果有儿子返回儿子
  }
  while (workingInProgressFiber) {
    // 如果没有儿子，当前节点其实已经结束了
    completeUnitOfWork(workingInProgressFiber);
    if (workingInProgressFiber.sibling) {
      return workingInProgressFiber.sibling; // 如果有弟弟返回弟弟
    }
    workingInProgressFiber = workingInProgressFiber.return; // 先指向父亲
  }
}

function beginWork(workingInProgressFiber) {
  console.log("beginWork", workingInProgressFiber.props.id);
  if (!workingInProgressFiber.stateNode) {
    workingInProgressFiber.stateNode = document.createElement(
      workingInProgressFiber.type
    );
  }
  for (let key in workingInProgressFiber.props) {
    if (key !== "children") {
      workingInProgressFiber.stateNode[key] = workingInProgressFiber.props[key];
    }
  } // 在beginWork里是不会挂载的

  // 创建子Fiber，返回第一个儿子
  let previousFiber;
  // children是一个虚拟DOM的数组
  workingInProgressFiber?.props?.children?.forEach((child, index) => {
    let childFiber = {
      type: child.type, //DOM节点类型
      props: child.props,
      return: workingInProgressFiber, // return 是一个指针，指向父元素，让父亲完成
      effectTag: "PLACEMENT", // 这个是fiber对应的DOM节点需要被插入到父DOM中去
      nextEffect: null, // 下一个有副作用的节点
    };
    if (index === 0) {
      workingInProgressFiber.child = childFiber;
    } else {
      previousFiber.sibling = childFiber;
    }
    previousFiber = childFiber;
  });
}

function completeUnitOfWork(workingInProgressFiber) {
  console.log("completeUnitOfWork", workingInProgressFiber.props.id);
  // 构建副作用链effectList 只有那些有副作用的节点
  // firstEffect 指向第一个由副作用的子节点
  // lastEffect 指向最后一个有副作用的子节点
  let returnFiber = workingInProgressFiber.return;
  if (returnFiber) {
    // 把当前fiber的有副作用子链表挂载到父亲身上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = workingInProgressFiber.firstEffect;
    }
    if (workingInProgressFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProgressFiber.firstEffect;
      }
      returnFiber.lastEffect = workingInProgressFiber.lastEffect;
    }
    // 再把自己挂载进去
    if (workingInProgressFiber.effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProgressFiber;
      } else {
        returnFiber.firstEffect = workingInProgressFiber;
      }
      returnFiber.lastEffect = workingInProgressFiber;
    }
  }
}

// 告诉浏览器在空闲得时候执行workLoop
requestIdleCallback(workLoop);
