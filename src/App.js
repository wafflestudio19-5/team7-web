import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [tempPong, setTempPong] = useState(false);

    const pingPong = () => {
        axios.get('ping/', {})
            .then((res) => {
                console.log(res.data.pong);
                if(res.data.pong === true){
                    setTempPong(!tempPong);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className={"App"}>
            <h1>Hello World!</h1>
            <h1 onClick={pingPong}> {tempPong ? "Ping" : "Pong"} </h1>
        </div>
    );
}

export default App;
