import { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import './SocialLogin.scss';
import {useSessionContext} from "../../Context/SessionContext";
import { toast} from 'react-toastify';

const SocialLogin = () => {
    const URLSearch = new URLSearchParams(window.location.search);
    const history = useHistory();
    const {handleLogin} = useSessionContext();

    useEffect(() => {

        const registerToken = URLSearch.get("token");
        console.log(registerToken);

        axios
            .get(`/api/v1/user/me`, {
                    headers: {
                        Authentication: registerToken,
                    },
                },
                {withCredentials: true}
            )
            .then((response) => {
                handleLogin(response.data.id, response.data.userId, response.data.image, registerToken);
                toast.success("로그인되었습니다.",{
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
            <div className="login-title">소셜로그인 중입니다.</div>
            <div>
                <BiLoaderAlt className="login-img"/>
            </div>
        </div>
    )
}

export default SocialLogin