import "./PostPage.scss";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import Header from "../MainPage/Header/Header";
import { GoMarkGithub } from "react-icons/go";


const PostPage = () => {

    const params = useParams();
    const history = useHistory();
    const [pageTitle, setPageTitle] = useState(null);
    const [postUserName, setPostUserName] = useState("");
    const [postContent, setPostContent] = useState();
    const [postUserImage, setPostUserImage] = useState();
    const [postUserUsername, setPostUserUsername] = useState();
    const [postUserIntro, setPostUserIntro] = useState("");
    const [githubId, setGithubId] = useState("");

    useEffect(() => {
        axios
            .get(`https://waflog.kro.kr/api/v1/post/${params.id}`)
            .then((response) => {
                setPageTitle(response.data.user.pageTitle);
                setPostUserName(response.data.user.name);
                setPostContent(response.data.content);
                setPostUserImage(response.data.user.image);
                setPostUserUsername(response.data.user.username);
                setPostUserIntro(response.data.user.shortIntro);
                setGithubId(response.data.user.githubId);
                console.log(postContent);
                console.log(params.id);
                console.log(response);

            })
            .catch((error) => {
                history.push("/error"); // 백엔드 404 response 필요!!
            });
    }, []);


    return (
       <div className="postpage">
           <Header pageTitle = {pageTitle}/>

           <div className="post-main-section">
               <div className="post-title">예시 제목 예시 제목</div>
               <div className="post-information-section">
                   <span className="post-user-name">
                       <a>{postUserName}</a>
                   </span>
                   <span className="post-separator">·</span>
                   <span className="post-datetime">
                       2022년 00월 00일
                   </span>
               </div>
               <ReactMarkdown className="post-content">{postContent}</ReactMarkdown>
           </div>

           <div className="post-user-section">
               <div className="post-user-info">
                   <img className="post-user-image" src={postUserImage} alt="유저 이미지"/>
                   <div className="post-user-text">
                       <div className="post-user-username">
                           <a>{postUserUsername}</a>
                       </div>
                       <div className="post-user-intro">{postUserIntro}</div>
                   </div>
               </div>
               <div className="post-user-division"/>
               <div className="post-user-sns">
                   <a className={"href-github"} href={`https://github.com/${githubId}`}>
                       <GoMarkGithub className={"icon-github"}/>
                   </a>
               </div>
           </div>

       </div>
    );
};

export default PostPage;
