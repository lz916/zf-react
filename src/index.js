import React from "react";
import ReactDOM from "react-dom";
class Parent extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }
  render() {
    console.log("父组件渲染");
    return <Child />;
  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selfCount: 1,
    };
    this.render();
  }
  render() {
    console.log("子组件渲染");
    return (
      <div>
        <div>父组件传进来的count: {this.props.count}</div>
        <div>自己的count: {this.state.selfCount}</div>
        <button
          onClick={() => {
            this.setState({
              selfCount: this.state.selfCount + 1,
            });
          }}
        >
          更新自己的count
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Parent />, document.getElementById("root"));
