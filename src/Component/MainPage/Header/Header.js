import {useState} from "react";
import {useHistory} from "react-router-dom";
import "./Header.scss";
import { IoSearchOutline } from "react-icons/io5";
import LoginModal from "../../LoginModal/LoginModal";
import "@fontsource/source-code-pro";


const Header = () => {

    const [isLogin, setIsLogin] = useState(false);
    const history = useHistory();

    const handleLogin = () => {
        setIsOpen(true);
    }
    const handleSearch = () => {
        history.push('/search');
    }
    const handleWrite = () => {
        history.push('/write');
    }
    const handleLogo = () => {
        history.push("");
    }
    
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className="header">
            <a className="logo" onClick={handleLogo} target="_blank">
                <img className="logo-img"
                     src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75"
                     alt="waffle_studio"/>
            </a>
            <div className="main-title" onClick={handleLogo}>Waflog</div>
            <IoSearchOutline className="search-icon" onClick={handleSearch}/>
            <button className="btn-write" onClick={handleWrite}>새 글 작성</button>
            <button className="btn-login" onClick={handleLogin}>로그인</button>
            <LoginModal isOpen={isOpen} setIsOpen={setIsOpen}></LoginModal>
        </div>
    )
}

export default Header;