import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tempPong, setTempPong] = useState(false);

  useEffect(() => {
    axios.get(`http://13.124.30.252:8080/ping/`, {}).then((response) => {
      console.log("response check");
      console.log(response);
      setTempPong(true);
    }).catch((error) => {
        console.log(error);
    });
  }, []);

  console.log("test");

  return (
    <div className={"App"}>
      <h1>Hello World!</h1>
      <h1>pong : {tempPong}</h1>
    </div>
  );
}

export default App;
