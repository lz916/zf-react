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
    }
    emitUpdate() {
        
    }
    updateComponent() {
    
    }
}

class Component {
    constructor(props) {
        this.props = props
        this.state = {}
        this.updater = new Updater(this)
    }
    setState(partialState, callback) {
        this.updater.addState(partialState, callback)
    }
}