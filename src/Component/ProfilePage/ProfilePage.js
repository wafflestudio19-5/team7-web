import "./ProfilePage.scss";
import { toast } from "react-toastify";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Header from "../MainPage/Header/Header";
import UserPost from "./UserPost/UserPost";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";

const ProfilePage = () => {
  const params = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const URLSearch = new URLSearchParams(search);
  const postPageRef = useRef({});
  const initialParams = URLSearch.get("q") === null ? "" : URLSearch.get("q");

  const [word, setWord] = useState(initialParams);
  const [userName, setUserName] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userShort, setUserShort] = useState("");
  const [userPost, setUserPost] = useState([]);
  const [postPageNumber, setPostPageNumber] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/v1/user/@${params.userId}`, {
        params: {},
      })
      .then((response) => {
        setUserName(response.data.name);
        setUserImg(response.data.image);
        setUserShort(response.data.shortIntro);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`/api/v1/user/@${params.userId}/search`, {
        params: {
          keyword: word,
          page: 0,
          size: 6,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserPost([]);
        setUserPost(response.data.content);
        if (response.data.last === true) {
          setPostPageNumber(null);
        } else {
          setPostPageNumber(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

  const handleWord = (e) => {
    setWord(e.target.value);
    history.replace(`/@${params.userId}?q=${e.target.value}`);
  };

  const handleScroll = () => {
    const scrollTop = postPageRef.current.scrollTop;
    const scrollHeight = postPageRef.current.scrollHeight;
    const clientHeight = postPageRef.current.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 10) {
      if (!(postPageNumber === null)) {
        axios
          .get(`/api/v1/user/@${params.userId}/search`, {
            params: {
              keyword: word,
              page: postPageNumber,
              size: 6,
            },
          })
          .then((response) => {
            setUserPost(userPost.concat(response.data.content));
            if (response.data.last === true) {
              setPostPageNumber(null);
            } else {
              setPostPageNumber(postPageNumber + 1);
            }
            console.log(userPost);
          });
      }
    }
  };

  return (
    <div className="profilepage" ref={postPageRef} onScroll={handleScroll}>
      <Header pageTitle={`${params.userId}.log`} />
      <div className="all-container">
        <div className="main-profile">
          <div className="user-info">
            <div className="user-img">
              <img
                className="userprofile-img"
                src={userImg}
                alt="waffle_studio"
              />
            </div>
            <div className="user-introduce">
              <div className="user-id">{userName}</div>
              <div className="user-summary">{userShort}</div>
            </div>
          </div>
          <div className="horizon-line" />
          <div className="user-link"></div>
        </div>
        <div className="post-type">
          <div className="select-type">
            <a className="type-btn">글 목록</a>
          </div>
        </div>
        <div className="user-search">
          <div className="user-searchbox">
            <IoIosSearch className="searchpage-icon" />
            <input
              className="search-input"
              placeholder="검색어를 입력하세요"
              value={word}
              onChange={handleWord}
            />
          </div>
        </div>
        <ul className="userpost-list">
          {userPost.map((item) => (
            <UserPost item={item} userId={params.userId} key={item.id} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
