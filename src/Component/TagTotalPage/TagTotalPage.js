import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./TagTotalPage.scss";
import Header from "../MainPage/Header/Header";
import { IoIosSearch } from "react-icons/io";
import SearchItem from "../SearchPage/SearchItem/SearchItem";
import { BiLoaderAlt } from "react-icons/bi";

const TagTotalPage = () => {
  const history = useHistory();
  const params = useParams();
  const tagPageRef = useRef({});

  const [totalTagNumber, setTotalTagNumber] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPageNumber, setSearchPageNumber] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/v1/tag?sort=name`, {
        params: {
          page: 0,
          size: 100
        },
      })
      .then((response) => {
        console.log(response);
        setTotalTagNumber(response.data.totalElements);
        setTagList(response.data.content);
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
          .get(`/api/v1/tag`, {
            params: {
              page: searchPageNumber,
              size: 100
            },
          })
          .then((response) => {
            setTagList(tagList.concat(response.data.content));
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
    <div className="tagtotalpage" ref={tagPageRef} onScroll={handleScroll}>
      <Header pageTitle={"Waflog"} />

      <h1 className="tag-title">전체 태그 목록</h1>

      {isLoading ? (
        <div className="loading-section">
          <BiLoaderAlt className="loading-icon" />
          <div className={"loading-text"}>로딩 중입니다.</div>
        </div>
      ) : (
        <>
          {isSearching ? (
            <div className="tag-search-info">
              총 <b>{totalTagNumber}개</b>의 태그를 찾았습니다.
            </div>
          ) : (
            <div className="tag-search-info">검색결과가 없습니다.</div>
          )}
          <ul className="post-tag-list">
            {tagList.map((item) => (
              <a className="post-tag-href" href={`/tag/${item.url}`}>
                <div className="post-tag-item" item={item} key={item.id}>
                  {item.name}
                </div>
              </a>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TagTotalPage;
