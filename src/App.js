import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import MainPage from "./Component/MainPage/MainPage";
import SearchPage from "./Component/SearchPage/SearchPage";

function App() {
    const [tempPong, setTempPong] = useState(false);

    const pingPong = () => {
        axios.get("http://13.124.30.252/ping/", {})
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
        <BrowserRouter>
            <Switch>
                <Route path="/search" component={SearchPage} exact={true}></Route>
                <Route path="" component={MainPage} exact={true}></Route>
                <Redirect to=""></Redirect>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
