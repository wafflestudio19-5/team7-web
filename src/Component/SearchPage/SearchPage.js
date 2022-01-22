import { useHistory, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./SearchPage.scss";
import Header from "../MainPage/Header/Header";
import { IoIosSearch } from "react-icons/io";
import SearchItem from "./SearchItem/SearchItem";
import { BiLoaderAlt } from "react-icons/bi";

const SearchPage = () => {
  const history = useHistory();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const searchPageRef = useRef({});
  const initialParams = params.get("q") === null ? "" : params.get("q");

  const [tag, setTag] = useState(initialParams);
  const [searchData, setSearchData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filtedNumber, setFiltedNumber] = useState(0);
  const [searchPageNumber, setSearchPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleInput = (e) => {
    setTag(e.target.value);
    history.replace(`/search?q=${e.target.value}`);
  };

  useEffect(() => {
    axios
      .get(`/api/v1/post/search`, {
        params: {
          keyword: tag,
          page: 0,
          size: 6,
        },
      })
      .then((response) => {
        console.log(response.data.content);
        setIsLoading(false);
        setSearchData(response.data.content);
        setFiltedNumber(response.data.totalElements);
        if (response.data.last === true) {
          setSearchPageNumber(null);
        } else {
          setSearchPageNumber(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (searchData === null || tag === null || tag === "" || tag.length === 0) {
      setIsSearching(false);
      setTag("");
    } else {
      setIsSearching(true);
      setTag(params.get("q"));
    }
  }, [tag]);

  const handleScroll = () => {
    const scrollTop = searchPageRef.current.scrollTop;
    const scrollHeight = searchPageRef.current.scrollHeight;
    const clientHeight = searchPageRef.current.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 10) {
      if (!(searchPageNumber === null)) {
        axios
          .get("api/v1/post/search", {
            params: {
              keyword: tag,
              page: searchPageNumber,
              size: 6,
            },
          })
          .then((response) => {
            setSearchData(searchData.concat(response.data.content));
            if (response.data.last === true) {
              setSearchPageNumber(null);
            } else {
              setSearchPageNumber(searchPageNumber + 1);
            }
          });
      }
    }
  };

  return (
    <div className="searchpage" ref={searchPageRef} onScroll={handleScroll}>
      <Header />
      <div className="searchbox">
        <IoIosSearch className="searchpage-icon" />
        <div className="search-input-box">
          <input
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={tag}
            onChange={handleInput}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="loading-section">
          <BiLoaderAlt className="loading-icon" />
          <div className={"loading-text"}>검색 중입니다.</div>
        </div>
      ) : (
        <>
          {isSearching ? (
            <div className="search-info">
              총 <b>{filtedNumber}개</b>의 포스트를 찾았습니다.
            </div>
          ) : (
            <div className="search-info">검색결과가 없습니다.</div>
          )}
          <ul className="search-list">
            {searchData.map((item) => (
              <SearchItem item={item} key={item.id} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SearchPage;
