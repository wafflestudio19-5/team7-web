import "./ReplyItem.scss";

import dayjs from "dayjs";
import { useSessionContext } from "../../../../Context/SessionContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";

const ReplyItem = ({
  replyItem,
  setTargetCommentId,
  setIsDeleteOpen,
  setUpdateComment,
  postId,
  setIsLoginOpen,
  parentCommentId,
}) => {
  const { id, token, isLogin } = useSessionContext();

  const [isReplyModifying, setIsReplyModifying] = useState(false);
  const [modifyInput, setModifyInput] = useState(replyItem.content);
  const [isRereplying, setIsRereplying] = useState(false);
  const [rereplyInput, setRereplyInput] = useState("");

  const handleModify = () => {
    setIsReplyModifying(true);
    console.log(replyItem.content);
  };

  const handleDelete = () => {
    setTargetCommentId(replyItem.id);
    setIsDeleteOpen(true);
  };

  const cancelModify = () => {
    setIsReplyModifying(false);
  };

  const completeModify = () => {
    axios
      .put(
        `/api/v1/post/${postId}/comment/${replyItem.id}`,
        { content: modifyInput },
        {
          headers: {
            Authentication: token,
          },
        }
      )
      .then((response) => {
        setUpdateComment(dayjs());
        setIsReplyModifying(false);
        toast.success("댓글이 수정되었습니다.");
      })
      .catch((error) => {
        toast.error("댓글이 비어있는지 확인해주세요.");
      });
  };

  const handleShowRereply = () => {
    if (isRereplying === true) {
      setIsRereplying(false);
    } else {
      setIsRereplying(true);
    }
  };

  const handleComment = () => {
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

    axios
      .post(
        `/api/v1/post/${postId}/comment`,
        {
          parentComment: replyItem.id,
          content: rereplyInput,
        },
        {
          headers: {
            Authentication: token,
          },
        }
      )
      .then((response) => {
        setRereplyInput("");
        setUpdateComment(dayjs());
        setIsRereplying(false);
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
    <div className={replyItem.depth === 1 ? "reply-item" : "rereply-item"}>
      <div className="reply-info">
        <div className="reply-info-profile">
          <a href={"/@" + replyItem.user.userId}>
            <img
              className="reply-info-image"
              src={replyItem.user.image}
              alt={"유저 이미지"}
            />
          </a>
          <div className="reply-info-detail">
            <div className="reply-info-userId">
              <a
                className="reply-info-userId-href"
                href={"/@" + replyItem.user.userId}
              >
                {replyItem.user.userId}
              </a>
            </div>
            <div className="reply-info-date">
              {dayjs(replyItem.createdAt).format("YYYY년 MM월 DD일")}
            </div>
          </div>
        </div>

        {parseInt(id) === replyItem.user.id ? (
          <div className="reply-actions">
            <button className="reply-actions-button" onClick={handleModify}>
              수정
            </button>
            <button className="reply-actions-button" onClick={handleDelete}>
              삭제
            </button>
          </div>
        ) : (
          <div />
        )}
      </div>

      {isReplyModifying ? (
        <>
          <textarea
            className="reply-input"
            placeholder="댓글을 입력하세요."
            value={modifyInput}
            onChange={(e) => setModifyInput(e.target.value)}
          />

          <div className="reply-button-wrapper">
            <button className="reply-button-cancel" onClick={cancelModify}>
              취소
            </button>
            <button className="reply-button-modify" onClick={completeModify}>
              댓글 수정
            </button>
          </div>
        </>
      ) : (
        <div className="reply-content">{replyItem.content}</div>
      )}

      {replyItem.depth === 1 ? (
        <>
          <div className="reply-button-show" onClick={handleShowRereply}>
            {isRereplying === true ? (
              <>
                <AiOutlineMinusSquare className="reply-icon-plus" />
                <span>숨기기</span>
              </>
            ) : (
              <>
                <AiOutlinePlusSquare className="reply-icon-plus" />

                <span>답글 달기</span>
              </>
            )}
          </div>

          {isRereplying === true ? (
            <>
              <div className="rereply">
                <div className="rereply-space" />
                <textarea
                  className="post-comments-input"
                  placeholder="댓글을 입력하세요."
                  value={rereplyInput}
                  onChange={(e) => setRereplyInput(e.target.value)}
                />

                <div className="post-comments-button-wrapper">
                  <button
                    className="post-comments-button"
                    onClick={handleComment}
                  >
                    댓글 작성
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div />
          )}
        </>
      ) : (
        <div />
      )}
    </div>
  );
};

export default ReplyItem;
