import { useHistory, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./TagPage.scss";
import Header from "../MainPage/Header/Header";
import { IoIosSearch } from "react-icons/io";
import SearchItem from "../SearchPage/SearchItem/SearchItem";
import { BiLoaderAlt } from "react-icons/bi";

const TagPage = () => {
  const history = useHistory();
  const params = useParams();
  const tagPageRef = useRef({});

  const [totalPostNumber, setTotalPostNumber] = useState(0);
  const [tagPostList, setTagPostList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPageNumber, setSearchPageNumber] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/v1/tag/${params.tagUrl}`, {
        params: {
          page: 0,
          size: 10,
        },
      })
      .then((response) => {
        console.log(response);
        setTotalPostNumber(response.data.totalElements);
        setTagPostList(response.data.content);
        setIsSearching(true);
        setIsLoading(false);

        if (response.data.last === true) {
          setSearchPageNumber(null);
        } else {
          setSearchPageNumber(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleScroll = () => {
    const scrollTop = tagPageRef.current.scrollTop;
    const scrollHeight = tagPageRef.current.scrollHeight;
    const clientHeight = tagPageRef.current.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 10) {
      if (!(searchPageNumber === null)) {
        axios
          .get(`/api/v1/tag/${params.tagUrl}`, {
            params: {
              page: searchPageNumber,
              size: 10,
            },
          })
          .then((response) => {
            setTagPostList(tagPostList.concat(response.data.content));
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
    <div className="tagpage" ref={tagPageRef} onScroll={handleScroll}>
      <Header pageTitle={"Waflog"} />

      <div className="tag-main-section">
        <h1 className="tag-title"># {params.tagUrl}</h1>

        {isLoading ? (
          <div className="loading-section">
            <BiLoaderAlt className="loading-icon" />
            <div className={"loading-text"}>검색 중입니다.</div>
          </div>
        ) : (
          <>
            {isSearching ? (
              <div className="tag-search-info">
                총 <b>{totalPostNumber}개</b>의 포스트를 찾았습니다.
              </div>
            ) : (
              <div className="tag-search-info">검색결과가 없습니다.</div>
            )}
            <ul className="tag-post-list">
              {tagPostList.map((item) => (
                <SearchItem item={item} key={item.id} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default TagPage;
