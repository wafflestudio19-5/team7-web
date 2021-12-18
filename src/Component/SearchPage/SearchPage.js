import {useHistory} from "react-router-dom";
import {useState} from "react";
import './SearchPage.scss';
import Header from '../MainPage/Header/Header';
import { IoIosSearch } from "react-icons/io";


const SearchPage = () => {

    const [isLogin,setIsLogin] = useState(false);
    const history = useHistory();

    const handleLogin = () => {
        setIsLogin(!isLogin);
    }
    const handleLogo = () => {
        history.replace("");
    }

    const [tag, setTag] = useState('');

    return(
        <div className="searchpage">
            <Header/>
            <div className="searchbox">
                <IoIosSearch className="searchpage-icon" color/>
                <input className="search-input" placeholder="검색어를 입력하세요" value={tag} onChange={(e) => setTag(e.target.value)}/>
            </div>
        </div>
    )
}

export default SearchPage;