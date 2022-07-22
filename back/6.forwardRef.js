import React from "react";
import ReactDOM from "react-dom";
/**
 * 不能在函数组件上使用ref，因为他们没有实列
 */
function TextInput(props, ref) {
  console.log(123);
  console.log(ref);
  return <input ref={ref} />;
}

const ForwardTextInput = React.forwardRef(TextInput);
console.log(456);
console.log(ForwardTextInput);

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  getFormFocus = () => {
    this.textInputRef.current.focus();
  };

  render() {
    return (
      <>
        <ForwardTextInput ref={this.textInputRef} />
        <button onClick={this.getFormFocus}>获得焦点</button>
      </>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById("root"));
