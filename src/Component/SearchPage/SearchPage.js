import {useHistory} from "react-router-dom";
import {useState} from "react";
import './SearchPage.scss';

const SearchPage = () => {

    const [isLogin,setIsLogin] = useState(false);
    const history = useHistory();

    const handleLogin = () => {
        setIsLogin(!isLogin);
    }
    const handleLogo = () => {
        history.replace("");
    }

    return(
        <div className="searchpage">
            <div className="header">
                <a className="logo" onClick={handleLogo} target="_blank">
                    <img className="logo-img" src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75" alt="waffle_studio"/>
                </a>
                <div className="goback" onClick={handleLogo}>뒤로가기</div>
                {isLogin ? <div className="userprofile" onClick={handleLogin}>로그아웃</div> : <div className="btn-login" onClick={handleLogin}>로그인</div>}
            </div>
            <div className="searchbox">
                <input className="search-input" value={"기다려주세오"}/>
            </div>
        </div>
    )
}

export default SearchPage;