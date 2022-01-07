import "./CommentsItem.scss";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import { useSessionContext } from "../../../Context/SessionContext";

const CommentsItem = ({ item, setIsOpen, setTargetCommentId }) => {
  const history = useHistory();
  const { userId } = useSessionContext();

  const handleModify = () => {
    history.push("/post/@" + item.user.userId + "/" + item.url);
  };

  const handleDelete = () => {
    setTargetCommentId(item.rootComment.id);
    setIsOpen(false);
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

        {userId === item.rootComment.user.userId ? (
            <div className="comments-actions">
              <button className="comments-actions-span" onClick={handleModify}>수정</button>
              <button className="comments-actions-span" onClick={handleDelete}>삭제</button>
            </div>
        ) : (
            <div />
        )}

      </div>
      <div className="comments-content">{item.rootComment.content}</div>
    </div>
  );
};

export default CommentsItem;
