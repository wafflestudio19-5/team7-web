import {useHistory, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import {useEffect, useState, useRef} from "react";
import './SearchPage.scss';
import Header from '../MainPage/Header/Header';
import { IoIosSearch } from "react-icons/io";
import SearchItem from './SearchItem/SearchItem';

const SearchPage = () => {

    const history = useHistory();
    const {search} = useLocation();
    const params = new URLSearchParams(search);
    const searchPageRef = useRef({});
    
    const [tag, setTag] = useState(`${params.get('q')}`);
    const [searchData, setSearchData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filtedNumber, setFiltedNumber] = useState(0);
    const [searchPageNumber, setSearchPageNumber] = useState(0);
    
    const handleInput = (e) => {
        setTag(e.target.value);
        history.replace(`/search?q=${e.target.value}`);
    }

    useEffect(() => {
        if(searchData === null || tag === null || tag === "" || tag.length === 0){
            setIsSearching(false);
            setTag("");
        }
        else{
            setIsSearching(true);
            setFiltedNumber(searchData.length);
            setTag(params.get('q'));
        }
    },[params]);

    useEffect(() => {
        axios
            .get(`https://waflog.kro.kr/api/v1/post/search`, {
                params: {
                    keyword: tag,
                    page: 0,
                    size: 4
                },
            })
            .then((response) => {
                console.log(response.data.content);
                setSearchData(response.data.content);
                if (response.data.last === true) {
                    setSearchPageNumber(null);
                }
                else{
                    setSearchPageNumber(1);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [tag]);

    const handleScroll = () => {
        const scrollTop = searchPageRef.current.scrollTop;
        const scrollHeight = searchPageRef.current.scrollHeight;
        const clientHeight = searchPageRef.current.clientHeight;

        if (scrollHeight - scrollTop - clientHeight === 0) {
            if (!(searchPageNumber === null)) {
                axios
                    .get("https://waflog.kro.kr/api/v1/post/search", {
                        params: {
                            keyword: tag,
                            page: searchPageNumber,
                            size: 4
                        },
                    })
                    .then((response) => {
                        setSearchData(searchData.concat(response.data.content));
                        if (response.data.last === true) {
                            setSearchPageNumber(null);
                        } else {
                            setSearchPageNumber(searchPageNumber + 1);
                        }
                        console.log(searchData);
                        console.log(searchPageNumber);
                    });
            }
        }
    };

    return(
        <div className="searchpage" ref={searchPageRef} onScroll={handleScroll}>
            <Header/>
            <div className="searchbox">
                <IoIosSearch className="searchpage-icon" color/>
                <div className="search-input-box">
                    <input className="search-input" placeholder="검색어를 입력하세요" value={tag} onChange={handleInput}/>
                </div>
            </div>
            {isSearching ? <div className="search-info">총 <b>{filtedNumber}개</b>의 포스트를 찾았습니다.</div> : <div className="search-info">검색결과가 없습니다.</div> }
            <ul className="search-list">
                {searchData.map((item) => (
                    <SearchItem item={item} key={item.id} />
                ))}
            </ul>
        </div>
    )
}

export default SearchPage;