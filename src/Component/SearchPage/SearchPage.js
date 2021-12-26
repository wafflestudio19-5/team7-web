import {useHistory, useParams, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import './SearchPage.scss';
import Header from '../MainPage/Header/Header';
import { IoIosSearch } from "react-icons/io";
import SearchItem from './SearchItem/SearchItem';

import dummyData from '../DummyData.js';
import PostItem from '../MainPage/PostItem/PostItem'

const SearchPage = () => {

    const history = useHistory();
    const {search} = useLocation();
    const params = new URLSearchParams(search);

    const [isLogin,setIsLogin] = useState(false);
    const [tag, setTag] = useState(params.get('q'));
    //이거 때문에 warning 많이 뜨는데 백엔드랑 연결하면 상수로 고정시킬수 있을것 같습니다.
    const [searchData, setSearchData] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [filtedNumber, setFiltedNumber] = useState(0);

    const handleLogin = () => {
        setIsLogin(!isLogin);
    }
    const handleLogo = () => {
        history.replace("");
    }
    const handleInput = (e) => {
        setTag(e.target.value);
        history.replace(`/search?q=${e.target.value}`);
    }

    const filtedPost = dummyData.filter(function (elements){
        if(params.get('q') === null || params.get('q').length === 0){
            return null;
        }
        return (typeof elements.summary == "string" && elements.summary.indexOf(params.get('q')) > -1);
    });

    useEffect(() => {
        if(filtedPost === null || tag === null || tag === "" || tag.length === 0){
            setIsSearching(false);
            setTag("");
        }
        else{
            setIsSearching(true);
            setFiltedNumber(filtedPost.length);
            setTag(params.get('q'));
        }
    },[params]);

    return(
        <div className="searchpage">
            <Header/>
            <div className="searchbox">
                <IoIosSearch className="searchpage-icon" color/>
                <div className="search-input-box">
                    <input className="search-input" placeholder="검색어를 입력하세요" value={tag} onChange={handleInput}/>
                </div>
            </div>
            {isSearching ? <div className="search-info">총 {filtedNumber}개의 포스트를 찾았습니다.</div> : <div className="search-info">검색결과가 없습니다.</div> }
            <ul className="search-list">
                {filtedPost.map((item) => (
                    <SearchItem item={item} key={item.id} />
                ))}
            </ul>
        </div>
    )
}

export default SearchPage;