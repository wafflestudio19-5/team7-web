import "./PostPage.scss";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import Header from "../MainPage/Header/Header";
import { BsLink45Deg } from "react-icons/bs";
import {
  AiFillHome,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { GrMail } from "react-icons/gr";
import { GoMarkGithub } from "react-icons/go";
import { BsFacebook } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CommentsItem from "./CommentsItem/CommentsItem";
import { useSessionContext } from "../../Context/SessionContext";
import CommentsDeleteModal from "./CommentsDeleteModal/CommentsDeleteModal";
import LoginModal from "../LoginModal/LoginModal";

import Prism from "prismjs";
import "prismjs/themes/prism.css";

import "@toast-ui/editor/dist/toastui-editor.css";

import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import remarkGfm from "remark-gfm";

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
      content: "수정할 내용을 입력하세요.",
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
  },
];

const PostPage = () => {
  const params = useParams();
  const history = useHistory();

  const { token, isLogin } = useSessionContext();

  const [postResponse, setPostResponse] = useState(dataFormat);
  const [postId, setPostId] = useState();
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentsList, setCommentsList] = useState(commentsData);
  const [commentInput, setCommentInput] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetCommentId, setTargetCommentId] = useState();
  const [updateComment, setUpdateComment] = useState();
  const [isLike, setIsLike] = useState(false);

  const [source, setSource] = useState(dataFormat);

  const currentUrl = window.location.href;

  useEffect(() => {
    console.log("POSTPAGE REFRESH");
    axios
        .get(`api/v1/post/@${params.userId}/${params.postUrl}`)
        .then((response) => {
          setPostResponse(response.data);
          setSource(response.data);
          setPostId(response.data.id);
          setCommentsCount(response.data.comments.count);
          setCommentsList(response.data.comments.contents);
          console.log(source.content);
        })
        .catch((error) => {
          console.log(error);
          history.push("/error"); // 백엔드 404 response 필요!!
        });
  }, []);

  const handleLike = () => {
    // toast.success("좋아요 실행");

    axios
      .post(
        `/api/v1/post/${postId}/like`,
        {},
        {
          headers: {
            Authentication: token,
          },
        }
      )
      .then((response) => {
        if (isLike === false) {
          setIsLike(true);
        } else {
          setIsLike(false);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("먼저 로그인해주세요.");
        setIsLoginOpen(true);
      });
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

  const handleComment = () => {
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

    axios
      .post(
        `/api/v1/post/${postId}/comment`,
        {
          content: commentInput,
        },
        {
          headers: {
            Authentication: token,
          },
        }
      )
      .then((response) => {
        setCommentInput("");
        setCommentsCount(response.data.count);
        setCommentsList(response.data.contents);
        toast.success("댓글이 작성되었습니다.");
      })
      .catch((error) => {
        console.log(error);
        toast.error("먼저 로그인해주세요.");
        setIsLoginOpen(true);
      });
  };

  useEffect(() => {
    // console.log("POSTPAGE REFRESH");
    axios
      .get(`api/v1/post/@${params.userId}/${params.postUrl}`)
      .then((response) => {
        console.log(response);
        setPostResponse(response.data);
        setPostId(response.data.id);
        setCommentsCount(response.data.comments.count);
        setCommentsList(response.data.comments.contents);

        if (isLogin === true) {
          axios
            .get(`api/v1/post/${response.data.id}/like/current`, {
              headers: {
                Authentication: token,
              },
            })
            .then((response) => {
              console.log(response);
              if (response.data === true) {
                setIsLike(true);
              }
            })
            .catch((error) => {
              console.log(error);
              history.push("/error"); // 백엔드 404 response 필요!!
            });
        }
      })
      .catch((error) => {
        console.log(error);
        history.push("/error"); // 백엔드 404 response 필요!!
      });
  }, [updateComment]);

  return (
    <div className="postpage">
      <ToastContainer />
      <Header pageTitle={postResponse.user.pageTitle} />

      <div className="post-main-section">
        <div className="post-title">{postResponse.title}</div>
        <div className="post-information-section">
          <span className="post-user-id">
            <a
              className="post-user-id-href"
              href={"/@" + postResponse.user.userId}
            >
              {postResponse.user.userId}
            </a>
          </span>
          <span className="post-separator">·</span>
          <span className="post-datetime">
            {dayjs(postResponse.createdAt).format("YYYY년 MM월 DD일")}
          </span>

          <div className="post-like-section">
            <div className="post-like-wrapper" onClick={handleLike}>
              {isLike === true ? (
                <svg
                  className={"icon-heart"}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path className={"icon-heart-path"} />
                </svg>
              ) : (
                <svg
                  className={"icon-heart-unlike"}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path className={"icon-heart-path"} />
                </svg>
              )}
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

        <ReactMarkdown
          className="post-content"
          remarkPlugins={[remarkGfm]}
          components={{img({ node, ...props }) {
              return (
                  <img
                      style={{ maxWidth: "60vw" }}
                      src={props.src.replace("../../../../public/", "/")}
                      alt="MarkdownRenderer__Image"
                  />
              );
            },}}
        >
          {source.content}
        </ReactMarkdown>
      </div>

      <div className="post-user-section">
        <div className="post-user-info">
          <a href={"/@" + postResponse.user.userId}>
            <img
              className="post-user-image"
              src={postResponse.user.image}
              alt="유저 이미지"
            />
          </a>
          <div className="post-user-text">
            <div className="post-user-name">
              <a
                className="post-user-name-href"
                href={"/@" + postResponse.user.userId}
              >
                {postResponse.user.name}
              </a>
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

        <div className="post-order-section">
          <div className="post-prev-section">
            {postResponse.prevPost !== null ? (
              <a
                className="post-prev-box"
                href={`/post/@${postResponse.user.userId}/${postResponse.prevPost.url}`}
              >
                <div className="post-prev-arrow-wrapper">
                  <AiOutlineArrowLeft className="post-prev-arrow-ico" />
                </div>

                <div className="post-prev-text-wrapper">
                  <div className="post-prev-text-description">이전 포스트</div>
                  <h3 className="post-prev-text-title">
                    {postResponse.prevPost.title}
                  </h3>
                </div>
              </a>
            ) : (
              <div />
            )}
          </div>

          <div className="post-next-section">
            {postResponse.nextPost !== null ? (
              <a
                className="post-next-box"
                href={`/post/@${postResponse.user.userId}/${postResponse.nextPost.url}`}
              >
                <div className="post-next-arrow-wrapper">
                  <AiOutlineArrowRight className="post-prev-arrow-ico" />
                </div>

                <div className="post-next-text-wrapper">
                  <div className="post-next-text-description">다음 포스트</div>
                  <h3 className="post-next-text-title">
                    {postResponse.nextPost.title}
                  </h3>
                </div>
              </a>
            ) : (
              <div />
            )}
          </div>
        </div>

        <div className="post-comments-section">
          <h4 className="post-comments-count">{commentsCount}개의 댓글</h4>

          <textarea
            className="post-comments-input"
            placeholder="댓글을 입력하세요."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />

          <div className="post-comments-button-wrapper">
            <button className="post-comments-button" onClick={handleComment}>
              댓글 작성
            </button>
          </div>

          <ul className={"post-comments-list"}>
            {commentsList.map((item) => (
              <CommentsItem
                item={item}
                key={item.id}
                setIsDeleteOpen={setIsDeleteOpen}
                setIsLoginOpen={setIsLoginOpen}
                setTargetCommentId={setTargetCommentId}
                postId={postId}
                setCommentsList={setCommentsList}
                setUpdateComment={setUpdateComment}
              />
            ))}
          </ul>
        </div>
      </div>

      <CommentsDeleteModal
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        postId={postId}
        targetCommentId={targetCommentId}
        setCommentsCount={setCommentsCount}
        setCommentsList={setCommentsList}
        setUpdateComment={setUpdateComment}
      />

      <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
    </div>
  );
};

export default PostPage;
