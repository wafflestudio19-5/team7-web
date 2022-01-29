import "./SeriesPage.scss";
import { toast } from "react-toastify";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Header from "../MainPage/Header/Header";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { AiTwotoneMail, AiOutlineGithub, AiOutlineTwitter, AiFillFacebook, AiFillHome } from "react-icons/ai";
import {useSessionContext} from "../../Context/SessionContext";
import dayjs from "dayjs";
import {BiLoaderAlt} from "react-icons/bi";

const SeriesPage = () => {
    const params = useParams();
    const history = useHistory();
    const { handleLogout, id, isLogin, userId, token } = useSessionContext();

    const [userName, setUserName] = useState("");
    const [userImg, setUserImg] = useState("");
    const [userShort, setUserShort] = useState("");
    const [userPageTitle, setUserPageTitle] = useState("");

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

    const [userSeries, setUserSeries] = useState([]);

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
                console.log(error);
            });

        axios
            .get(`/api/v1/user/@${params.userId}/series`, {
                params: {
                },
            })
            .then((response) => {
                console.log(response.data);
                setUserSeries(response.data.content);
                setIsLoading(false);
            });

    },[]);

    return (
        <div className="seriespage">
            <Header pageTitle={userPageTitle} pageUser={params.userId} />
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
                    <div className="select-type">
                        <a className="type-btn" href={`/@${params.userId}`} aria-current="page">글 목록</a>
                    </div>
                    <div className="select-type-on">
                        <a className="type-btn-on" href={`/@${params.userId}/series`}>시리즈</a>
                    </div>
                    <div className="select-type">
                        <a className="type-btn" href={`/@${params.userId}/about`}>소개</a>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-section">
                        <BiLoaderAlt className="loading-icon" />
                        <div className={"loading-text"}>로딩 중입니다.</div>
                    </div>
                ) : (
                <>
                {userSeries.length === 0 ?
                    <div className="series-wrapper-empty">
                        <div className="series-empty-img">
                            <img src="https://static.velog.io/static/media/undraw_blank_canvas_3rbb.35e81baf.svg" alt="list is empty" className="empty-img"/>
                            <div className="empty-message">시리즈가 없습니다.</div>
                        </div>
                    </div>
                    :
                    <div className="series-wrapper">
                        {userSeries.map((item) => (
                            <div className="series-contents" key={item.id}>
                                <a className="series-thumb" href={`/@${params.userId}/series/${item.name}`}>
                                    <div className="series-thumb-wrapper">
                                        {item.thumbnail === "" ?
                                            <img className="series-thumb-img" src="https://static.velog.io/static/media/series-thumbnail.4c53a750.svg"/>
                                            :
                                            <img className="series-thumb-img" src={item.thumbnail}/>
                                        }
                                    </div>
                                </a>
                                <h4 className="series-title">
                                    <a className="series-title-href" href={`/@${params.userId}/series/${item.name}/${item.id}`}>{item.name}</a>
                                </h4>
                                <div className="series-info">
                                    <span className="count">{item.postCount}개의 포스트</span>
                                    <span className="dot">·</span>
                                    마지막 업데이트 {dayjs(item.createAt).format("YYYY년 MM월 DD일")}
                                </div>
                            </div>
                        ))}
                    </div>
                }</>)}
            </div>
        </div>
    );
};

export default SeriesPage;
