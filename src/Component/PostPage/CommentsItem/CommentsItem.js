import "./CommentsItem.scss";
import { useHistory } from "react-router-dom";
import { useSessionContext } from "../../../Context/SessionContext";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import ReplyItem from "./ReplyItem/ReplyItem";

const CommentsItem = ({
  item,
  setIsDeleteOpen,
  setTargetCommentId,
  postId,
  setCommentsList,
  setUpdateComment,
  setIsLoginOpen,
}) => {
  const history = useHistory();
  const { id, token, isLogin } = useSessionContext();
  const [isModifying, setIsModifying] = useState(false);
  const [modifyInput, setModifyInput] = useState(item.rootComment.content);
  const [showReply, setShowReply] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleModify = () => {
    setIsModifying(true);
    setModifyInput(item.rootComment.content);
    console.log(item.rootComment.content);
  };

  const handleDelete = () => {
    setTargetCommentId(item.rootComment.id);
    setIsDeleteOpen(true);
  };

  const cancelModify = () => {
    setIsModifying(false);
  };

  const completeModify = () => {
    axios
      .put(
        `/api/v1/post/${postId}/comment/${item.rootComment.id}`,
        { content: modifyInput },
        {
          headers: {
            Authentication: token,
          },
        }
      )
      .then((response) => {
        setUpdateComment(dayjs());
        setIsModifying(false);
        toast.success("댓글이 수정되었습니다.");
      })
      .catch((error) => {
        toast.error("댓글이 비어있는지 확인해주세요.");
      });
  };

  const handleShowReply = () => {
    if (showReply === true) {
      setShowReply(false);
      setIsReplying(false);
    } else {
      setShowReply(true);
      if (item.replies.count === 0) {
        setIsReplying(true);
      }
    }
  };

  const handleReplying = () => {
    if (isReplying === true) {
      setIsReplying(false);
    } else {
      setIsReplying(true);
    }
  };

  const handleComment = () => {
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

    axios
      .post(
        `/api/v1/post/${postId}/comment`,
        {
          parentComment: item.rootComment.id,
          content: replyInput,
        },
        {
          headers: {
            Authentication: token,
          },
        }
      )
      .then((response) => {
        setReplyInput("");
        setUpdateComment(dayjs());
        setIsReplying(false);
        toast.success("댓글이 작성되었습니다.");
      })
      .catch((error) => {
        console.log(error);

        if(token === null) {
          toast.error("먼저 로그인해주세요.");
          setIsLoginOpen(true);
        }
        else{
          toast.error("댓글이 비어있는지 확인해주세요.");
        }
      });
  };

  return (
    <div className="comments-item">
      <div className="comments-info-section">
        <div className="comments-info-profile">
          <a href={"/@" + item.rootComment.user.userId}>
            <img
              className="comments-info-image"
              src={item.rootComment.user.image}
              alt={"유저 이미지"}
            />
          </a>
          <div className="comments-info-detail">
            <div className="comments-info-userId">
              <a
                className="comments-info-userId-href"
                href={"/@" + item.rootComment.user.userId}
              >
                {item.rootComment.user.userId}
              </a>
            </div>
            <div className="comments-info-date">
              {dayjs(item.rootComment.createdAt).format("YYYY년 MM월 DD일")}
            </div>
          </div>
        </div>

        {parseInt(id) === item.rootComment.user.id ? (
          <div className="comments-actions">
            <button className="comments-actions-button" onClick={handleModify}>
              수정
            </button>
            <button className="comments-actions-button" onClick={handleDelete}>
              삭제
            </button>
          </div>
        ) : (
          <div />
        )}
      </div>

      {isModifying ? (
        <>
          <textarea
            className="post-comments-input"
            placeholder="댓글을 입력하세요."
            value={modifyInput}
            onChange={(e) => setModifyInput(e.target.value)}
          />

          <div className="post-comments-button-wrapper">
            <button
              className="post-comments-button-cancel"
              onClick={cancelModify}
            >
              취소
            </button>
            <button
              className="post-comments-button-modify"
              onClick={completeModify}
            >
              댓글 수정
            </button>
          </div>
        </>
      ) : (
        <div className="comments-content">{item.rootComment.content}</div>
      )}

      <div className="reply-section">
        <div className="reply-button-show" onClick={handleShowReply}>
          {showReply === true ? (
            <>
              <AiOutlineMinusSquare className="reply-icon-plus" />
              <span>숨기기</span>
            </>
          ) : (
            <>
              <AiOutlinePlusSquare className="reply-icon-plus" />
              {item.replies.count === 0 ? (
                <span>답글 달기</span>
              ) : (
                <span>{item.replies.count}개의 답글</span>
              )}
            </>
          )}
        </div>

        {showReply === true ? (
          <>
            <ul className="reply-list">
              {item.replies.contents.map((replyItem) => (
                <ReplyItem
                  replyItem={replyItem}
                  key={replyItem.id}
                  setTargetCommentId={setTargetCommentId}
                  setIsDeleteOpen={setIsDeleteOpen}
                  setUpdateComment={setUpdateComment}
                  postId={postId}
                  setIsLoginOpen={setIsLoginOpen}
                  parentCommentId={item.rootComment.id}
                />
              ))}

              <div className="reply-space" />

              {isReplying === false ? (
                <button className="reply-button-write" onClick={handleReplying}>
                  답글 작성하기
                </button>
              ) : (
                <>
                  <textarea
                    className="post-comments-input"
                    placeholder="댓글을 입력하세요."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                  />

                  <div className="post-comments-button-wrapper">
                    <button
                      className="reply-button-cancel"
                      onClick={handleReplying}
                    >
                      취소
                    </button>
                    <button
                      className="post-comments-button"
                      onClick={handleComment}
                    >
                      댓글 작성
                    </button>
                  </div>
                </>
              )}
            </ul>
          </>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default CommentsItem;
