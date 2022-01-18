import { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import "./LoginPage.scss";
import { useSessionContext } from "../../Context/SessionContext";
import { toast } from "react-toastify";

const LoginPage = () => {
  const URLSearch = new URLSearchParams(window.location.search);
  const history = useHistory();
  const { handleLogin } = useSessionContext();

  useEffect(() => {
    const registerToken = URLSearch.get("token");
    const email = URLSearch.get("email");
    console.log(registerToken);

    axios
      .post(
        `https://waflog.kro.kr/api/v1/auth/verify/login`,
        {
          token: registerToken,
          email: email,
        }
      )
      .then((response) => {
        handleLogin(
          response.data.user.id,
          response.data.user.userId,
          response.data.user.image,
          response.data.token
        );
        toast.success("로그인되었습니다.", {
          autoClose: 4000,
        });
        console.log(response.data);
        history.replace("");
      })
      .catch((error) => {
        toast.error("잘못된 요청입니다. 다시 시도해주세요.", {
          autoClose: 4000,
        });
        history.replace("");
      });
  }, []);

  return (
    <div className="loginpage">
      <div className="login-title">로그인 중입니다.</div>
      <div>
        <BiLoaderAlt className="login-img" />
      </div>
    </div>
  );
};

export default LoginPage;
