import "./PostPage.scss";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import Header from "../MainPage/Header/Header";
import { BsLink45Deg } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { GrMail } from "react-icons/gr";
import { GoMarkGithub } from "react-icons/go";
import { BsFacebook } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CommentsItem from "./CommentsItem/CommentsItem";

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
    userId: "",
  },
};

const commentsData = [
  {
    rootComment: {
      id: 0,
      user: {
        id: 0,
        userId: "abc",
        image: "https://picsum.photos/id/2/200",
      },
      content: "이것은 예시 댓글입니다!",
      depth: 2,
      createdAt: "2021-12-29T17:33:43",
    },
    replyNumber: 1,
    replies: [
      {
        id: 1,
        user: {
          id: 1,
          userId: "abc",
          image: "https://picsum.photos/id/2/200",
        },
        content: "abc",
        depth: 3,
        createdAt: "2021-12-29T17:33:43",
      },
    ],
  },
  {
    rootComment: {
      id: 0,
      user: {
        id: 0,
        userId: "waflog-test",
        image: "https://picsum.photos/id/2/200",
      },
      content: "이것은 두 번째 예시 댓글입니다!",
      depth: 2,
      createdAt: "2021-12-29T17:33:43",
    },
    replyNumber: 1,
    replies: [
      {
        id: 1,
        user: {
          id: 1,
          userId: "abc",
          image: "https://picsum.photos/id/2/200",
        },
        content: "abc",
        depth: 3,
        createdAt: "2021-12-29T17:33:43",
      },
    ],
  }
];

const PostPage = () => {
  const params = useParams();
  const history = useHistory();
  const [postResponse, setPostResponse] = useState(dataFormat);

  const currentUrl = window.location.href;

  const handleLike = () => {
    toast.success("좋아요 실행");
  };

  const handleLink = () => {
    toast.success("링크가 복사되었습니다.");
  };

  const scrollToTop = () => {
    // 클릭하면 스크롤이 위로 올라가는 함수
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    axios
      .get(
        `https://waflog.kro.kr/api/v1/post/@${params.userId}/${params.postUrl}`
      )
      .then((response) => {
        setPostResponse(response.data);
      })
      .catch((error) => {
        history.push("/error"); // 백엔드 404 response 필요!!
      });
  }, []);

  console.log(postResponse);

  return (
    <div className="postpage">
      <div id={"scroller"}>
        <ToastContainer />
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

            <div className="post-like-section">
              <div className="post-like-wrapper" onClick={handleLike}>
                <svg
                  className={"icon-heart"}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path className={"icon-heart-path"} />
                </svg>
              </div>
              <div className="post-like-count">{postResponse.likes}</div>

              <CopyToClipboard text={currentUrl}>
                <div className="post-like-wrapper" onClick={handleLink}>
                  <BsLink45Deg className="icon-link" />
                </div>
              </CopyToClipboard>

              <div className="post-scroll-top" onClick={scrollToTop}>
                TOP
              </div>
            </div>
          </div>

          <ReactMarkdown className="post-content">
            {postResponse.content}
          </ReactMarkdown>
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
              <div className="post-user-intro">
                {postResponse.user.shortIntro}
              </div>
            </div>
          </div>
          <div className="post-user-division" />
          <div className="post-user-sns">
            {postResponse.user.githubId !== "" ? (
              <a
                className={"href-sns"}
                href={`https://github.com/${postResponse.user.githubId}`}
              >
                <GoMarkGithub className={"icon-sns"} />
              </a>
            ) : (
              <div />
            )}

            {postResponse.user.facebookId !== "" ? (
              <a
                className={"href-sns"}
                href={`https://facebook.com/${postResponse.user.facebookId}`}
              >
                <BsFacebook className={"icon-sns"} />
              </a>
            ) : (
              <div />
            )}

            {postResponse.user.twitterId !== "" ? (
              <a
                className={"href-sns"}
                href={`https://twitter.com/${postResponse.user.twitterId}`}
              >
                <BsTwitter className={"icon-sns"} />
              </a>
            ) : (
              <div />
            )}

            {postResponse.user.homepage !== "" ? (
              <a className={"href-sns"} href={postResponse.user.homepage}>
                <AiFillHome className={"icon-sns"} />
              </a>
            ) : (
              <div />
            )}

            {postResponse.user.publicEmail !== "" ? (
              <a
                className={"href-sns"}
                href={"mailto:" + postResponse.user.publicEmail}
              >
                <GrMail className={"icon-sns"} />
              </a>
            ) : (
              <div />
            )}
          </div>

          <div className="post-comments-section">
            <h4 className="post-comments-count">{}개의 댓글</h4>

            <input
              className="post-comments-input"
              placeholder="댓글을 입력하세요."
            />

            <div className="post-comments-button-wrapper">
              <button className="post-comments-button">댓글 작성</button>
            </div>

            <ul className={"post-comments-list"}>
              {commentsData.map((item) => (
                <CommentsItem item={item} key={item.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
