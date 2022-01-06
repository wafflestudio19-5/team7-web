import {createContext, useContext, useState} from "react";

const initialState = {};

const SessionContext = createContext(initialState);

export const SessionProvider = ({ children }) => {

    const [isLogin, setIsLogin] = useState(false);
    const [token, setToken] = useState(null);

    const [userId, setUserId] = useState("");
    const [userImg, setUserImg] = useState("");

    const handleLogin = (token, id, img) =>{
        localStorage.setItem('token',token);
        setToken(localStorage.getItem('token'));
        setIsLogin(true);
        setUserId(id);
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
            value={{isLogin, token, userId, userImg, handleLogin,handleLogout}}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => useContext(SessionContext);