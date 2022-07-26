import React from "react";
import ReactDOM from "react-dom";
/**
 * 不能在函数组件上使用ref，因为他们没有实列
 */

class Couter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
  }
  handleClick = (event) => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>改变</button>
        {this.state.visible ? (
          <ul>
            <li key="A">A</li>
            <li key="B">B</li>
            <li key="C">C</li>
            <li key="D">D</li>
            <li key="E">E</li>
            <li key="F">F</li>
          </ul>
        ) : (
          <ul>
            <li key="A">A</li>
            <li key="C">C</li>
            <li key="E">E</li>
            <li key="B">B</li>
            <li key="G">G</li>
          </ul>
        )}
      </div>
    );
  }
}

ReactDOM.render(<Couter />, document.getElementById("root"));
