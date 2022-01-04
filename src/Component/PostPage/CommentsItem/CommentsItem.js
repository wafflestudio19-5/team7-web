import "./CommentsItem.scss";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";

const CommentsItem = ({ item }) => {
  const history = useHistory();

  const handlePostClick = () => {
    history.push("/post/@" + item.user.userId + "/" + item.url);
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
      </div>
      <div className="comments-content">{item.rootComment.content}</div>
    </div>
  );
};

export default CommentsItem;
