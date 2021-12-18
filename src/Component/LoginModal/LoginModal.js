import {useState} from "react";
import Modal from 'react-modal';
import './LoginModal.scss';

const LoginModal = ( props ) => {

    const {isOpen, setIsOpen} = props;
    
    const [emailInput, setEmailInput] = useState("");

    return(
        <Modal className="login-modal" isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <h1 className="login-modal-title">로그인</h1>
            <h2 className="login-modal-email">이메일로 로그인</h2>
            <div className="login-modal-inputbox">
                <input className="login-modal-input" placeholder="이메일을 입력하세요." value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                <button className="login-modal-btn">로그인</button>
            </div>
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
        </Modal>
    )
}

export default LoginModal;