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

const ProfilePage = () => {
  const params = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const URLSearch = new URLSearchParams(search);
  const postPageRef = useRef({});
  const initialParams = URLSearch.get("q") === null ? "" : URLSearch.get("q");
  const { handleLogout, id, isLogin, userId, token } = useSessionContext();

  const [word, setWord] = useState(initialParams);
  const [userName, setUserName] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userShort, setUserShort] = useState("");
  const [userPost, setUserPost] = useState([]);
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
          setUserLink(response.data.publicEmail, response.data.homepage, response.data.githubId, response.data.facebookId, response.data.twitterId)
        })
        .catch((error) => {
          console.log(error);
        });
  },[]);

  useEffect(() => {

    axios
      .get(`/api/v1/user/@${params.userId}/search`, {
        headers: {
          Authentication: token,
        },
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
            headers: {
              Authentication: token,
            },
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
                <a className="user-link-social" target="_blank" href={`${userHome}`} rel="noopener noreferrer">
                  <AiFillHome className="user-social-icon"/>
                </a>
                :
                null
            }
          </div>
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
        <div className="tag-menubar">
          <div className="tag-wrapper">
            <div className="tag-title">태그 목록</div>
            <ul className="tag-contents">
              ㅇ
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
