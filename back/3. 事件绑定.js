import ReactDOM from "react-dom";
import React from "react";

/**
 * state的更新可能时异步
 * 出于性能考虑React可能会把多个setState合并成同一个调用
 * 如何判断它是同步还是异步，是不是批量
 * 一个原则是方式React能管控的地方，批量的异步的，如事件处理函数，生命周期函数
 * 不能管控的地方就是同步的，非批量的，如setInterval setTimeout 原生DOM事件
 */
class Counter extends React.Component {
  state = { number: 0 }; // 定义状态有两种方式
  // 在事件处理函数中，setState的调用会批量执行
  // 在事件处理函数，setState并不会修改this.stat 等事件处理函数结束后再进行更新
  // 如果要setState是同步的，可以在外面加setTimeOut
  // setState的同步异步不是js的同步异步而是说是否是批量的
  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
    // 在其他react不能管控的地方，就是同步执行
    setTimeout(() => {
      this.setState({
        number: this.state.number + 1,
      });
      console.log(this.state.number);
      this.setState({
        number: this.state.number + 1,
      });
      console.log(this.state.number);
    }, 0);
  };
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
