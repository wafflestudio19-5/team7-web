import "./CommentsItem.scss";
import { useHistory } from "react-router-dom";
import { useSessionContext } from "../../../Context/SessionContext";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const CommentsItem = ({
  item,
  setIsOpen,
  setTargetCommentId,
  postId,
  setCommentsList,
  setUpdateComment,
}) => {
  const history = useHistory();
  const { userId, token } = useSessionContext();
  const [isModifying, setIsModifying] = useState(false);
  const [modifyInput, setModifyInput] = useState(item.rootComment.content);

  const handleModify = () => {
    setIsModifying(true);
    console.log(item.rootComment.content);
  };

  const handleDelete = () => {
    setTargetCommentId(item.rootComment.id);
    setIsOpen(true);
  };

  const cancelModify = () => {
    setIsModifying(false);
  };

  const completeModify = () => {
    axios
      .put(
        `https://waflog.kro.kr/api/v1/post/${postId}/comment/${item.rootComment.id}`,
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
        toast.error("댓글 수정 오류");
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

        { userId === item.rootComment.user.userId ? (
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
    </div>
  );
};

export default CommentsItem;
