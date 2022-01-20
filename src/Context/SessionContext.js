import {createContext, useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

const initialState = {};

const SessionContext = createContext(initialState);

export const SessionProvider = ({ children }) => {
    
    const history = useHistory();

    const [isLogin, setIsLogin] = useState(localStorage.getItem('token') !== null);
    //const [isLogin, setIsLogin] = useState(true);

    const [token, setToken] = useState(localStorage.getItem('token') === null ?  null :  localStorage.getItem('token'));
    //const [token, setToken] = useState("Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDE5MjgwNzgsImlhdCI6MTY0MTg5MjA3OCwiZW1haWwiOiJna3NlaGRkdXE5MTJAZ21haWwuY29tIn0.2oBMwUeo0J5hpN8uHQRU5HgDCSXa-W0RocYxUd2cjeY");

    const [id, setId] = useState(localStorage.getItem('id') === null ?  "" :  localStorage.getItem('id'));
    //const [id, setId] = useState("20");

    const [userId, setUserId] = useState(localStorage.getItem('userId') === null ?  "" :  localStorage.getItem('userId'));
    //const [userId, setUserId] = useState("idplace");

    const [userImg, setUserImg] = useState(localStorage.getItem('userImg') === null ?  "" :  localStorage.getItem('userImg'));
    //const [userImg, setUserImg] = useState("https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75");

    useEffect(() => {
        localStorage.setItem('token',token);
        localStorage.setItem('id',id);
        localStorage.setItem('userId',userId);
        localStorage.setItem('userImg',userImg);
    },)

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
        localStorage.removeItem('id');
        localStorage.removeItem('userId');
        localStorage.removeItem('userImg');
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