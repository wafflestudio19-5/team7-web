import { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import './LoginPage.scss';

const LoginPage = () => {

    const URLSearch = new URLSearchParams(window.location.search);

    useEffect(() => {
        const registerCode = URLSearch.get("code");
        const email = URLSearch.get("email")
        console.log(registerCode);

        axios
            .post(`https://waflog.kro.kr/api/v1/auth/verify/login`, {
                    token: registerCode,
                    email: email,
            },
                {withCredentials: true}
            )
            .then((response) => {
                console.log(registerCode);
                console.log(response.data);
            })
    }, []);

    return(
        <div className="loginpage">
            <div className="login-title">로그인 중입니다.</div>
            <div>
                <BiLoaderAlt className="login-img"/>
            </div>
        </div>
    )
}

export default LoginPage