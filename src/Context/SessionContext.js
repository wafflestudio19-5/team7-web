import {createContext, useContext, useState} from "react";

const initialState = {};

const SessionContext = createContext(initialState);

export const SessionProvider = ({ children }) => {

    const [isLogin, setIsLogin] = useState(false);
    const [token, setToken] = useState(null);

    const [id, setId] = useState("");
    const [userId, setUserId] = useState("");
    const [userImg, setUserImg] = useState("");

    const handleLogin = (id, userid, img, token) =>{
        localStorage.setItem('token',token);
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