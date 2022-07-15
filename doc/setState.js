let isBatchingUpdate = true;

let queue = [];

let state = { number: 0 };

function setState(newState) {
  if (isBatchingUpdate) {
    queue.push(newState);
  } else {
    state = { ...state, ...newState };
  }
}

function handleClick() {
  isBatchingUpdate = true;
  /**我们自己逻辑开始*/
  setState({ number: 1 });
  console.log(state);
  setState({ number: 2 });
  /**我们自己逻辑结束*/
  state = queue.reduce((newState, action) => {
    return { ...state, ...action };
  }, state);
}
