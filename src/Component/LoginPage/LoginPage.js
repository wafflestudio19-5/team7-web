import { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {

    const URLSearch = new URLSearchParams(window.location.search);

    useEffect(() => {
        const registerCode = URLSearch.get("code");
        const email = URLSearch.get("email")
        console.log(registerCode);

        axios
            .get(`https://waflog.kro.kr/api/v1/auth/verify/login`, {
                params: {
                    token: registerCode,
                    email: email,
                },
            },
                {withCredentials: true}
            )
            .then((response) => {
                console.log(registerCode);
                console.log(response);
            })
            .catch((error) => {});
    }, []);

    return(
        <div>로그인확인용</div>
    )
}

export default LoginPage