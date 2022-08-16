import ReactDOM from "./react-dom";
import React from "./react";
let themeContent = React.createContext();
const { Provider } = themeContent;

class Title extends React.Component {
  static contextType = themeContent;

  render() {
    console.log(123);
    console.log(this.context);
    return (
      <div>
        <div
          style={{
            margin: "10px",
            border: `1px solid ${this.context.color}`,
            width: "200px",
          }}
        >
          title
        </div>
      </div>
    );
  }
}

class Content extends React.Component {
  static contextType = themeContent;
  render() {
    return (
      <div>
        <div
          style={{
            margin: "10px",
            border: `1px solid ${this.context.color}`,
            width: "200px",
          }}
        >
          content
          <span
            style={{ border: `1px solid ${this.context.color}` }}
            onClick={() => {
              console.log("red");
              console.log(this.context);
              this.context.changeColor("red");
            }}
          >
            红色
          </span>
          <span
            style={{ border: `1px solid ${this.context.color}` }}
            onClick={() => {
              this.context.changeColor("green");
            }}
          >
            绿色
          </span>
        </div>
      </div>
    );
  }
}
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red",
    };
  }
  changeColor = (color) => {
    this.setState({ color });
  };
  render() {
    return (
      <Provider
        value={{
          color: this.state.color,
          changeColor: this.changeColor,
        }}
      >
        <div
          style={{ margin: "10px", border: `1px solid ${this.state.color}` }}
        >
          <Title />
          <Content />
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<Page name={"lz"} />, document.getElementById("root"));
