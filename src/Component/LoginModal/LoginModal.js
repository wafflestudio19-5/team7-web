import {useState, useEffect} from "react";
import Modal from 'react-modal';
import axios from "axios";
import './LoginModal.scss';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginModal = ( props ) => {

    const {isOpen, setIsOpen} = props;

    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    
    const [emailInput, setEmailInput] = useState("");
    const [isUser, setIsUser] = useState(true);
    const [disable, setDisable] = useState(false);

    const [signUpReq, setSignUpReq] = useState(false);

    const [loginReqType, setLoginReqType] = useState(false);
    const [loginReq, setLoginReq] = useState(false);

    Modal.setAppElement('#root');

    const handleType = () => {
        setIsUser(!isUser);
    }

    //로그인 버튼
    const handleLogin = () => {
        if(regExp.test(emailInput)){
            setDisable(true);

            axios
                .post(`https://waflog.kro.kr/api/v1/auth/user/login`, {
                    email : emailInput,
                })
                .then((response) => {
                    console.log(response.data);
                    if(response.data.existUser){
                        toast.success("로그인 이메일을 보냈습니다.",{
                            autoClose: 3000,
                        });
                        setSignUpReq(true);
                        setLoginReqType(true);
                        setLoginReq(true);
                    }
                    else{
                        toast.success("가입 이메일을 보냈습니다.",{
                            autoClose: 6000,
                        });
                        setSignUpReq(true);
                        setLoginReqType(true);
                        setLoginReq(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else{
            toast.error("잘못된 이메일 형식입니다.",{
                autoClose: 3000,
            });
        }

    }

    //회원가입 버튼
    const handleSignUp = () => {
        if(regExp.test(emailInput)){
            setDisable(true);

            axios
                .post(`https://waflog.kro.kr/api/v1/auth/user`, {
                    email : emailInput,
                })
                .then((response) => {
                    console.log(response.data);
                    if(response.data.existUser){
                        toast.error("이미 존재하는 이메일입니다.",{
                            autoClose: 3000,
                        });
                        setDisable(false);
                    }
                    else{
                        toast.success("가입 이메일을 보냈습니다.",{
                            autoClose: 6000,
                        });
                        setSignUpReq(true);
                        setLoginReqType(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else{
            toast.error("잘못된 이메일 형식입니다.",{
                autoClose: 3000,
            });
        }

    };

    return(
        <Modal className="login-modal" isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <ToastContainer/>
            {isUser ?
                <div>
                    <h1 className="login-modal-title">로그인</h1>
                    <h2 className="login-modal-email">이메일로 로그인</h2>
                    {loginReqType ?
                        loginReq ?
                            <div className="login-modal-inputbox">
                                <div className="login-link-alert">로그인 링크가 이메일로 전송되었습니다.</div>
                            </div>
                            :
                            <div className="login-modal-inputbox">
                                <div className="login-link-alert">회원가입 링크가 이메일로 전송되었습니다.</div>
                            </div>
                        :
                        <div className="login-modal-inputbox">
                            <input className="login-modal-input" placeholder="이메일을 입력하세요." disabled={disable} value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                            <button className="login-modal-btn" disabled={disable} onClick={handleLogin}>로그인</button>
                        </div>
                    }

                    <h2 className="login-modal-social">소셜 계정으로 로그인</h2>
                    <a className="login-github" href="https://v2.velog.io/api/v2/auth/social/redirect/github?next=/">
                        <img className="github-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png" alt="git"/>
                    </a>
                    <a className="login-google" href="https://v2.velog.io/api/v2/auth/social/redirect/google?next=/">
                        <img className="google-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png" alt="G" />
                    </a>
                    <a className="login-facebook" href="https://v2.velog.io/api/v2/auth/social/redirect/facebook?next=/search">
                        <img className="facebook-img" src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="f" />
                    </a>
                    <div className="select-box">
                        <span className="select-text">아직 회원이 아니신가요?</span>
                        <div className="select-type" onClick={handleType}>회원가입</div>
                    </div>
                </div> :
                <div>
                    <h1 className="login-modal-title">회원가입</h1>
                    <h2 className="login-modal-email">이메일로 회원가입</h2>
                    {signUpReq ?
                        <div className="login-modal-inputbox">
                            <div className="login-link-alert">회원가입 링크가 이메일로 전송되었습니다.</div>
                        </div>
                        :
                        <div className="login-modal-inputbox">
                            <input className="login-modal-input" placeholder="이메일을 입력하세요." value={emailInput} disabled={disable} onChange={(e) => setEmailInput(e.target.value)}/>
                            <button className="login-modal-btn" onClick={handleSignUp} disabled={disable}>회원가입</button>
                        </div>
                    }
                    <h2 className="login-modal-social">소셜 계정으로 회원가입</h2>
                    <a className="login-github" href="https://v2.velog.io/api/v2/auth/social/redirect/github?next=/">
                        <img className="github-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png" alt="git"/>
                    </a>
                    <a className="login-google" href="https://v2.velog.io/api/v2/auth/social/redirect/google?next=/">
                        <img className="google-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png" alt="G" />
                    </a>
                    <a className="login-facebook" href="https://v2.velog.io/api/v2/auth/social/redirect/facebook?next=/search">
                        <img className="facebook-img" src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="f" />
                    </a>
                    <div className="select-box">
                        <span className="select-text">계정이 이미 있으신가요?</span>
                        <div className="select-type" onClick={handleType}>로그인</div>
                    </div>
                </div>
            }
        </Modal>
    )
}

export default LoginModal;