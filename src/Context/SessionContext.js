import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {};

const SessionContext = createContext(initialState);

export const SessionProvider = ({ children }) => {
  const history = useHistory();

  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("token") !== null
  );
  //const [isLogin, setIsLogin] = useState(true);

  const [token, setToken] = useState(
    localStorage.getItem("token") === null
      ? null
      : localStorage.getItem("token")
  );
  //const [token, setToken] = useState("Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDMzMTU5NjIsImlhdCI6MTY0MzI3OTk2MiwiZW1haWwiOiJoYW5keTkxMkBuYXZlci5jb20ifQ.ykwk6BbtvQ_svhVhUWU54QXSlqUXXtTuXefprvqc4JI");

  const [id, setId] = useState(
    localStorage.getItem("id") === null ? "" : localStorage.getItem("id")
  );
  //const [id, setId] = useState("20");

  const [userId, setUserId] = useState(
    localStorage.getItem("userId") === null
      ? ""
      : localStorage.getItem("userId")
  );
  //const [userId, setUserId] = useState("idplace");

  const [userImg, setUserImg] = useState(
    localStorage.getItem("userImg") === null
      ? ""
      : localStorage.getItem("userImg")
  );
  //const [userImg, setUserImg] = useState("https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75");

  //자동 로그아웃 타이머
  const [count, setCount] = useState(0);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
  }, 600000);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  // 자동 로그아웃 처리
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      axios
        .post(`/api/v1/auth/verify/logout`, { token: token })
        .then((response) => {})
        .catch((error) => {
          toast.success("자동 로그아웃되었습니다.");
          handleLogout();
        });
    }
  }, [count]);

  const handleLogin = (id, userid, img, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("userId", userid);
    localStorage.setItem("userImg", img);
    setToken(localStorage.getItem("token"));
    setIsLogin(true);
    setId(id);
    setUserId(userid);
    setUserImg(img);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("userId");
    localStorage.removeItem("userImg");
    setIsLogin(false);
    setToken(null);
    setUserId("");
    setUserImg("");
  };

  return (
    <SessionContext.Provider
      value={{ isLogin, token, id, userId, userImg, handleLogin, handleLogout, setUserImg }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
