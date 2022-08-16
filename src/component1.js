class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance
    this.pendingStates = []
    this.callbacks = []
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState)
    if (typeof callback === 'function') {
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps
    this.updateComponent()
  }
  updateComponent() {
    let {classInstance, pendingStates, nextProps} = this
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
    }
  }
  // 根据老状态和队列计算新状态
  getState() {
    let {classInstance, pendingStates, callbacks} = this
    let {state} = classInstance
    pendingStates.forEach((nextState) => {
      if (typeof nextState === 'function') {
        nextState = nextState(state)
      }
      state = {...state, ...nextState}
    })
    callbacks.forEach((callback) => callback())
    return state
  }
}

function shouldUpdate(classInstance, nextProps, nextState) {
  if (nextProps) classInstance = nextProps
  classInstance.state = nextProps
  classInstance.state = nextState
  classInstance.forceUpdate(0)
}

class Component {
  static isReactComponent = {};
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this)
  }
  setState(partialState, callback) {
    this.updater.addState(partialState, callback)
  }
}

export default Component;
