import {useState} from "react";
import './MainPage.scss';
import {useHistory} from "react-router-dom";

const MainPage = () =>{

    const [isLogin,setIsLogin] = useState(false);
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
        <div className="mainpage">
            <div className="header">
                <a className="logo" onClick={handleLogo} target="_blank">
                    <img className="logo-img" src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75" alt="waffle_studio"/>
                </a>
                <div className="search" onClick={handleSearch}>검색</div>
            {isLogin ? <div className="userprofile" onClick={handleLogin}>로그아웃</div> : <div className="btn-login" onClick={handleLogin}>로그인</div>}
            </div>
        </div>
    )
}

export default MainPage;