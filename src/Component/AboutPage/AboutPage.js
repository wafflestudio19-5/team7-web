import "./AboutPage.scss";
import { toast } from "react-toastify";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Header from "../MainPage/Header/Header";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { AiTwotoneMail, AiOutlineGithub, AiOutlineTwitter, AiFillFacebook, AiFillHome } from "react-icons/ai";
import {useSessionContext} from "../../Context/SessionContext";

const AboutPage = () => {
    const params = useParams();
    const history = useHistory();
    const { handleLogout, id, isLogin, userId, token } = useSessionContext();

    const [userName, setUserName] = useState("");
    const [userImg, setUserImg] = useState("");
    const [userShort, setUserShort] = useState("");

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

    const [isMe, setIsMe] = useState(false);
    const [userLong, setUserLong] = useState("");
    const [eL, setEL] = useState(false);

    const [longWrite, setLongWrite] = useState(false);

    const [longValue, setLongValue] = useState("");

    const setUser = (currentId, long) => {
        if(Number(currentId) === Number(id)){
            setIsMe(true);
        }
        else{
            setIsMe(false);
        }

        if(long !== null && long !== "" && long.length !==0){
            setUserLong(long);
            setLongValue(long);
            setEL(true);
        }
        else{
            setEL(false);
        }
    }

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

    const handleLong = (e) => {
        setLongValue(e.target.value);
    }
    const handleSaveLong = () => {
        setLongWrite(false);
    }
    const handleWriteLong = () => {
        setLongWrite(true);
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

        axios
            .get(`/api/v1/user/@${params.userId}/about`, {
                params: {},
            })
            .then((response) => {
                console.log(response.data);
                setUser(response.data.id, response.data.longIntro);
            })
            .catch((error) => {
                console.log(error);
            });
    },[]);

    return (
        <div className="profilepage">
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
                            <a className="user-link-social" target="_blank" href={`${userHome}`} >
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
                    <div className="select-type" href={`/@${params.userId}/series`}>
                        <a className="type-btn">시리즈</a>
                    </div>
                    <div className="select-type-on" href={`/@${params.userId}/about`}>
                        <a className="type-btn-on">소개</a>
                    </div>
                </div>
                <div className="about">
                    {longWrite ?
                        <div className="about-write">
                            <div className="about-btn-wrapper">
                                <button className="about-btn" onClick={handleSaveLong}>저장하기</button>
                            </div>
                            <div className="about-input-wrapper">
                                <textarea
                                    className="about-input"
                                    placeholder={"당신은 어떤 사람인가요? 당신에 대해서 알려주세요"}
                                    value={longValue}
                                    onChange={handleLong}
                                />
                            </div>
                        </div>
                        :
                        <div className="about-write">
                            {eL ?
                                <div>
                                    {isMe ?
                                        <div className="about-btn-wrapper">
                                            <button className="about-btn" onClick={handleWriteLong}>수정하기</button>
                                        </div>
                                        :
                                        null
                                    }
                                    <div>
                                        <pre className="about-long">
                                            {longValue}
                                        </pre>
                                    </div>
                                </div>
                                :
                                <div className="about-write-none">
                                    <img src="https://static.velog.io/static/media/undraw_empty.5fd6f2b8.svg" alt="empth about" className="about-img"/>
                                    <div className="about-write-none-text">소개가 작성되지 않았습니다.</div>
                                    {isMe ?
                                        <button className="about-write-none-btn" onClick={handleWriteLong}>소개 글 작성하기</button>
                                        :
                                        null
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default AboutPage;