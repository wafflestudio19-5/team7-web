import { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import './LoginPage.scss';
import {useSessionContext} from "../../Context/SessionContext";
import {ToastContainer, toast} from 'react-toastify';

const LoginPage = () => {

    const URLSearch = new URLSearchParams(window.location.search);
    const history = useHistory();
    const {handleLogin} = useSessionContext();

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
                handleLogin(response.data.user.id, response.data.user.userId, response.data.user.image, response.data.token);
                toast.success("로그인을 성공했습니다.",{
                    autoClose: 4000,
                });
                console.log(response.data);
                history.replace('');
            })
            .catch((error) => {
                toast.error("잘못된 요청입니다. 다시 시도해주세요.",{
                    autoClose: 4000,
                });
                history.replace('');
            });
    }, []);

    return(
        <div className="loginpage">
            <ToastContainer/>
            <div className="login-title">로그인 중입니다.</div>
            <div>
                <BiLoaderAlt className="login-img"/>
            </div>
        </div>
    )
}

export default LoginPage