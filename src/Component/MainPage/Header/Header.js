import {useState} from "react";
import {useHistory} from "react-router-dom";
import "./Header.scss";
import { FaSearch } from "react-icons/fa";

const Header = () => {

    const [isLogin, setIsLogin] = useState(false);
    const history = useHistory();

    const handleLogin = () => {
        setIsLogin(!isLogin);
    }
    const handleSearch = () => {
        history.push('/search');
    }
    const handleLogo = () => {
        history.replace("");
    }

    return(
        <div className="Header">
            <a className="Logo" onClick={handleLogo} target="_blank">
                <img className="Logo-Img"
                     src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75"
                     alt="waffle_studio"/>
            </a>
            <div className="maintitle" onClick={handleLogo}>Walog</div>
            <FaSearch className="search-icon" onClick={handleSearch}/>
            <button className="btn-login">로그인</button>
        </div>
    )
}

export default Header;