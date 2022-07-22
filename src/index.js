import React from "react";
import ReactDOM from "react-dom";

class Counter extends React.Component {
  static defaultProps = {
    name: "珠峰",
  };
  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log("Counter 1.constructor");
  }
  componentWillMount() {
    console.log("Counter 2.componentWillMount");
  }
  // 当属性或者状态发生变化的时候，会走此方法来决定是否要渲染更新
  shouldComponentUpdate(nextProps, nextState) {
    console.log("Counter 5.shouldComponentUpdate");
    return nextState.number % 2 === 0; // 奇数更新 偶数不更新
  }

  componentWillUpdate() {
    console.log("Counter 6.componentWillUpdate");
  }
  componentDidUpdate() {
    console.log("Counter 7.componentDidUpdate");
  }
  handleClick = (event) => {
    this.setState({
      number: this.state.number + 1,
    });
  };

  render() {
    console.log("Counter 3.render");
    return (
      <div>
        <div>{this.state.number}</div>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
  componentDidMount() {
    console.log("Counter 4.componentDidMount");
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
