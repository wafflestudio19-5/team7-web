import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import MainPage from "./Component/MainPage/MainPage";
import SearchPage from "./Component/SearchPage/SearchPage";
import RecentPage from "./Component/RecentPage/RecentPage";
import WritePage from "./Component/WritePage/WritePage";

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
                <Route path="/search" component={SearchPage} exact={true}/>
                <Route path="/recent" component={RecentPage} exact={true}/>
                <Route path="/write" component={WritePage} exact={true}/>
                <Route path="" component={MainPage} exact={true}/>
                <Redirect to=""/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
