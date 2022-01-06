import {createContext, useContext, useState} from "react";
import { useHistory } from "react-router-dom";

const initialState = {};

const SessionContext = createContext(initialState);

export const SessionProvider = ({ children }) => {
    
    const history = useHistory();

    const [isLogin, setIsLogin] = useState(localStorage.getItem('token') !== null);
    const [token, setToken] = useState(null);

    const [id, setId] = useState(localStorage.getItem('id') === null ?  "" :  localStorage.getItem('id'));
    const [userId, setUserId] = useState(localStorage.getItem('userId') === null ?  "" :  localStorage.getItem('userId'));
    const [userImg, setUserImg] = useState(localStorage.getItem('userImg') === null ?  "" :  localStorage.getItem('userImg'));

    const handleLogin = (id, userid, img, token) =>{
        localStorage.setItem('token',token);
        localStorage.setItem('id',id);
        localStorage.setItem('userId',userid);
        localStorage.setItem('userImg',img);
        setToken(localStorage.getItem('token'));
        setIsLogin(true);
        setId(id);
        setUserId(userid);
        setUserImg(img);
    }
    const handleLogout = () =>{
        localStorage.removeItem('token');
        setIsLogin(false);
        setToken(null);
        setUserId("");
        setUserImg("");
    }

    return (
        <SessionContext.Provider
            value={{isLogin, token, id, userId, userImg, handleLogin,handleLogout}}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => useContext(SessionContext);