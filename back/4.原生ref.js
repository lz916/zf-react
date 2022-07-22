import React from "react";
import ReactDOM from "react-dom";

class Sum extends React.Component {
  numberA;
  numberB;
  result;
  constructor(props) {
    super(props);
    this.numberA = React.createRef(); // {current: null}
    this.numberB = React.createRef();
    this.result = React.createRef();
  }

  handleClick = (event) => {
    console.log(event);
    let numberA = this.numberA.current.value;
    let numberB = this.numberB.current.value;
    this.result.current.value = parseFloat(numberA) + parseFloat(numberB);
  };
  render() {
    return (
      <div>
        <>
          <input ref={this.numberA} />
          <input ref={this.numberB} />
          <button onClick={this.handleClick}>+</button>
          <input ref={this.result} />
        </>
      </div>
    );
  }
}

console.log(123);

ReactDOM.render(<Sum />, document.getElementById("root"));
