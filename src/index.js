import React from "react";
import ReactDOM from "react-dom";
function Counter() {
  console.warn("重新执行");
  let [number, setNumber] = React.useState(0);
  const number1 = 0;
  console.warn("number", number);
  console.warn("number1", number1);

  React.useEffect(() => {
    console.log("开启一个新的定时器");
    const timer = setInterval(() => {
      console.log("执行定时器", number);
      setNumber(number + 1);
      number1++;
    }, 1000);
    return () => {
      console.log("清空定时器", number);
      clearInterval(timer);
    };
  }, [number]);

  return (
    <div>
      <p>{number}</p>
      {/* <button onClick={handleClick}>+</button> */}
    </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById("root"));
