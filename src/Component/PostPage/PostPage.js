import "./PostPage.scss";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import Header from "../MainPage/Header/Header";
import { GoMarkGithub } from "react-icons/go";

const dataFormat = {
    comments: [],
    content: "",
    createdAt: "",
    id: 0,
    likes: 0,
    nextPost: {},
    prevPost: {},
    seriesPosts: null,
    tags: [],
    thumbnail: "",
    title: "",
    url: "",
    user: {
        facebookId: "",
        githubId: "",
        homepage: "",
        id: 0,
        image: "",
        name: "",
        pageTitle: "",
        publicEmail: "",
        shortIntro: "",
        twitterId: "",
        userId: ""
    }
}

const PostPage = () => {
  const params = useParams();
  const history = useHistory();
  const [postResponse, setPostResponse] = useState(dataFormat);

  useEffect(() => {
    axios
      .get(`https://waflog.kro.kr/api/v1/post/${params.id}`)
      .then((response) => {
        setPostResponse(response.data);
      })
      .catch((error) => {
        history.push("/error"); // 백엔드 404 response 필요!!
      });
  }, []);

  return (
    <div className="postpage">
      <Header pageTitle={postResponse.user.pageTitle} />

      <div className="post-main-section">
        <div className="post-title">{postResponse.title}</div>
        <div className="post-information-section">
          <span className="post-user-id">
            <a>{postResponse.user.userId}</a>
          </span>
          <span className="post-separator">·</span>
          <span className="post-datetime">
            {dayjs(postResponse.createdAt).format("YYYY년 MM월 DD일")}
          </span>
        </div>
        <ReactMarkdown className="post-content">{postResponse.content}</ReactMarkdown>
      </div>

      <div className="post-user-section">
        <div className="post-user-info">
          <img
            className="post-user-image"
            src={postResponse.user.image}
            alt="유저 이미지"
          />
          <div className="post-user-text">
            <div className="post-user-name">
              <a>{postResponse.user.name}</a>
            </div>
            <div className="post-user-intro">{postResponse.user.shortIntro}</div>
          </div>
        </div>
        <div className="post-user-division" />
        <div className="post-user-sns">
          <a className={"href-github"} href={`https://github.com/${postResponse.user.githubId}`}>
            <GoMarkGithub className={"icon-github"} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
