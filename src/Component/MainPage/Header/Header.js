import {useState} from "react";
import {useHistory} from "react-router-dom";
import "./Header.scss";
import { GoSearch } from "react-icons/go";
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
    const handleLogo = () => {
        history.replace("");
    }
    
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className="header">
            <a className="logo" onClick={handleLogo} target="_blank">
                <img className="logo-img"
                     src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75"
                     alt="waffle_studio"/>
            </a>
            <div className="main-title" onClick={handleLogo}>walog</div>
            <GoSearch className="search-icon" onClick={handleSearch}/>
            <button className="btn-write" onClick={handleLogin}>새 글 작성</button>
            <button className="btn-login" onClick={handleLogin}>로그인</button>
            <LoginModal isOpen={isOpen} setIsOpen={setIsOpen}></LoginModal>
        </div>
    )
}

export default Header;