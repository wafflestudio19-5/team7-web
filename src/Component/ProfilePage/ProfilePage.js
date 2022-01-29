import "./ProfilePage.scss";
import { toast } from "react-toastify";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Header from "../MainPage/Header/Header";
import UserPost from "./UserPost/UserPost";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { AiTwotoneMail, AiOutlineGithub, AiOutlineTwitter, AiFillFacebook, AiFillHome } from "react-icons/ai";
import {useSessionContext} from "../../Context/SessionContext";
import {BiLoaderAlt} from "react-icons/bi";

const ProfilePage = () => {
  const params = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const URLSearch = new URLSearchParams(search);
  const postPageRef = useRef({});
  const initialParams = URLSearch.get("q") === null ? "" : URLSearch.get("q");
  const initialTag = URLSearch.get("tag") === null ? "" : URLSearch.get("tag");
  const { token } = useSessionContext();

  const [word, setWord] = useState(initialParams);
  const [searchTag, setSearchTag] = useState(initialTag);
  const [userName, setUserName] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userShort, setUserShort] = useState("");
  const [userPost, setUserPost] = useState([]);
  const [userPageTitle, setUserPageTitle] = useState("");
  const [postPageNumber, setPostPageNumber] = useState(0);

  const [eE,setEE] = useState(false);
  const [eG,setEG] = useState(false);
  const [eF,setEF] = useState(false);
  const [eT,setET] = useState(false);
  const [eH,setEH] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userGit, setUserGit] = useState("");
  const [userFace, setUserFace] = useState("");
  const [userTwit, setUserTwit] = useState("");
  const [userHome, setUserHome] = useState("");

  const [tagMenuList, setTagMenuList] = useState([]);
  const [totalTag, setTotalTag] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const setUserLink = (email, home, g, f, t) => {
    setUserEmail(email);
    setUserHome(home);
    setUserGit(g);
    setUserFace(f);
    setUserTwit(t);

    if(email !== null && email !== "" && email.length !== 0){
      setEE(true);
    }
    else{
      setEE(false);
    }
    if(g !== null && g !== ""){
      setEG(true);
    }
    else{
      setEG(false);
    }
    if(f !== null && f !== ""){
      setEF(true);
    }
    else{
      setEF(false);
    }
    if(t !== null && t !== ""){
      setET(true);
    }
    else{
      setET(false);
    }
    if(home !== null && home !== ""){
      setEH(true);
    }
    else{
      setEH(false);
    }
  }

  useEffect(() => {
    axios
        .get(`/api/v1/user/@${params.userId}`, {
          headers: {
            Authentication: token,
          },
          params: {},
        })
        .then((response) => {
          setUserName(response.data.name);
          setUserImg(response.data.image);
          setUserShort(response.data.shortIntro);
          setUserPageTitle(response.data.pageTitle);
          setUserLink(response.data.publicEmail, response.data.homepage, response.data.githubId, response.data.facebookId, response.data.twitterId)
        })
        .catch((error) => {
          history.replace("/error");
          console.log(error);
        });

    axios
        .get(`/api/v1/user/@${params.userId}/tags`, {
          headers: {
            Authentication: token,
          },
          params: {},
        })
        .then((response) => {
          console.log("tag data");
          console.log(response.data);
          setTagMenuList(response.data.contents);
          setTotalTag(response.data.count);
        })
        .catch((error) => {
          console.log(error);
        });
  },[params]);

  useEffect(() => {

    if(searchTag !== ""){
      axios
          .get(`/api/v1/user/@${params.userId}/tag/${searchTag}`, {
            headers: {
              Authentication: token,
            },
            params: {
              keyword: word,
              page: 0,
              size: 10,
            },
          })
          .then((response) => {
            console.log(response.data);
            setUserPost([]);
            setUserPost(response.data.content);
            setIsLoading(false);
            if (response.data.last === true) {
              setPostPageNumber(null);
            } else {
              setPostPageNumber(1);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
    else{
      axios
          .get(`/api/v1/user/@${params.userId}/search`, {
            headers: {
              Authentication: token,
            },
            params: {
              keyword: word,
              page: 0,
              size: 10,
            },
          })
          .then((response) => {
            console.log(response.data);
            setUserPost([]);
            setUserPost(response.data.content);
            setIsLoading(false);
            if (response.data.last === true) {
              setPostPageNumber(null);
            } else {
              setPostPageNumber(1);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }


  }, [params]);

  const handleWord = (e) => {
    if(searchTag !== ""){
      setSearchTag("");
    }
    setWord(e.target.value);
    history.replace(`/@${params.userId}?q=${e.target.value}`);
  };

  const handleScroll = () => {
    const scrollTop = postPageRef.current.scrollTop;
    const scrollHeight = postPageRef.current.scrollHeight;
    const clientHeight = postPageRef.current.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 10) {
      if (!(postPageNumber === null)) {
        if(searchTag !== ""){
          axios
              .get(`/api/v1/user/@${params.userId}/tag/${searchTag}`, {
                headers: {
                  Authentication: token,
                },
                params: {
                  keyword: word,
                  page: postPageNumber,
                  size: 10,
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
        else{
          axios
              .get(`/api/v1/user/@${params.userId}/search`, {
                headers: {
                  Authentication: token,
                },
                params: {
                  keyword: word,
                  page: postPageNumber,
                  size: 10,
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
    }
  };

  const handleTotalTag = () => {
    window.location.href=`/@${params.userId}`;
  }
  const handleTag = (url) => {
    window.location.href=`/@${params.userId}?tag=${url}`;
  }

  return (
    <div className="profilepage" ref={postPageRef} onScroll={handleScroll}>
      <Header pageTitle={userPageTitle} pageUser={params.userId}/>
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
          <div className="user-link">
            {eE ?
                <a className="user-link-social" target="_blank" href={`mailto:${userEmail}`} rel="noopener noreferrer">
                  <AiTwotoneMail className="user-social-icon"/>
                </a>
                :
                null
            }
            {eG ?
                <a className="user-link-social" target="_blank" href={`https://github.com/${userGit}`} rel="noopener noreferrer">
                  <AiOutlineGithub className="user-social-icon"/>
                </a>
                :
                null
            }
            {eT ?
                <a className="user-link-social" target="_blank" href={`https://twitter.com/${userTwit}`} rel="noopener noreferrer">
                  <AiOutlineTwitter className="user-social-icon"/>
                </a>
                :
                null
            }
            {eF ?
                <a className="user-link-social" target="_blank" href={`https://facebook.com/${userFace}`} rel="noopener noreferrer">
                  <AiFillFacebook className="user-social-icon"/>
                </a>
                :
                null
            }
            {eH ?
                <a className="user-link-social" target="_blank" href={`https://${userHome}`} >
                  <AiFillHome className="user-social-icon"/>
                </a>
                :
                null
            }
          </div>
        </div>
        <div className="post-type">
          <div className="select-type-on">
            <a className="type-btn-on" href={`/@${params.userId}`} aria-current="page">글 목록</a>
          </div>
          <div className="select-type">
            <a className="type-btn" href={`/@${params.userId}/series`}>시리즈</a>
          </div>
          <div className="select-type">
            <a className="type-btn" href={`/@${params.userId}/about`}>소개</a>
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
        <div className="tag-menubar">
          <div className="tag-wrapper">
            <div className="tag-title">태그 목록</div>
            <ul className="tag-contents">
              <li className={`tag-menu-list ${ searchTag === "" ? 'on' : ''}`} onClick={handleTotalTag}>
                <a className="tag-href" href={`/@${params.userId}`}>전체 보기</a>
                <span className="tag-number">({totalTag})</span>
              </li>
              {tagMenuList.map((item) => (
                  <li className={`tag-menu-list ${item.url === searchTag ? 'on' : ''}`} item={item} key={item.id} onClick={() => handleTag(item.url)}>
                    <a className="tag-href" href={`/@${params.userId}?tag=${item.url}`}>{item.name}</a>
                    <span className="tag-number"> ({item.count})</span>
                  </li>
              ))}
            </ul>
          </div>
        </div>
        {isLoading ? (
            <div className="loading-section">
              <BiLoaderAlt className="loading-icon" />
              <div className={"loading-text"}>로딩 중입니다.</div>
            </div>
        ) : (
        <ul className="userpost-list">
          {userPost.map((item) => (
            <UserPost item={item} userId={params.userId} key={item.id} />
          ))}
        </ul>)}
      </div>
    </div>
  );
};

export default ProfilePage;
