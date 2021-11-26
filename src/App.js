import "./App.css";
import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    axios
        .get(`http://13.124.30.252:8080/ping`, {}
        )
        .then((response) => {
            console.log("check");
      console.log(response.data);
    });
  });

  console.log("test");

  return (
    <div>
      <h1>Hello World!</h1>;
    </div>
  );
}

export default App;
