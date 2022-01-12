import "./ReplyItem.scss";

import dayjs from "dayjs";
import { useSessionContext } from "../../../../Context/SessionContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReplyItem = ({
  replyItem,
  setTargetCommentId,
  setIsDeleteOpen,
  setUpdateComment,
  postId,
  setIsLoginOpen,
}) => {
  const { id, token } = useSessionContext();

  const [isReplyModifying, setIsReplyModifying] = useState(false);
  const [modifyInput, setModifyInput] = useState(replyItem.content);

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
        toast.error("댓글 수정 오류");
      });
  };


  return (
    <div className="reply-item">
      <div className="reply-info">
        <div className="comments-info-profile">
          <a href={"/@" + replyItem.user.userId}>
            <img
              className="comments-info-image"
              src={replyItem.user.image}
              alt={"유저 이미지"}
            />
          </a>
          <div className="comments-info-detail">
            <div className="comments-info-userId">
              <a
                className="comments-info-userId-href"
                href={"/@" + replyItem.user.userId}
              >
                {replyItem.user.userId}
              </a>
            </div>
            <div className="comments-info-date">
              {dayjs(replyItem.createdAt).format("YYYY년 MM월 DD일")}
            </div>
          </div>
        </div>
      </div>

      {parseInt(id) === replyItem.user.id ? (
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

      {isReplyModifying ? (
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
        <div className="comments-content">{replyItem.content}</div>
      )}

    </div>
  );
};

export default ReplyItem;
