import "./PostItem.scss";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";

const PostItem = ({ item }) => {
  const history = useHistory();

  const handlePostClick = () => {
    history.push("/post/@" + item.user.userId + "/" + item.url);
  };

  return (
    <div className="PostItem">
      {item.thumbnail === null || item.thumbnail === "" ? (
        <div />
      ) : (
        <div className={"PostPhotoSection"} onClick={handlePostClick}>
          <img
            className={"PostPhoto"}
            src={item.thumbnail}
            alt={"포스트 이미지"}
          />
        </div>
      )}
      <div className={"PostMainSection"} onClick={handlePostClick}>
        <h4 className={"PostTitle"}>{item.title}</h4>
        <p className={"PostSummary"}>{item.summary}</p>
        <p className={"PostSubInfo"}>
          {dayjs(item.createAt).format("YYYY년 MM월 DD일")} · {item.comments}
          개의 댓글
        </p>
      </div>
      <div className={"PostSubSection"}>
        <a className={"PostAuthorInfo"} href={"/@" + item.user.userId}>
          <img
            className={"PostAuthorImg"}
            src={item.user.image}
            alt={"저자 이미지"}
          />
          <span className={"PostAuthorName"}>
            by <b>{item.user.userId}</b>
          </span>
        </a>

        <div className={"Likes"}>
          <svg
            className={"HeartIcon"}
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path className={"HeartPath"} />
          </svg>
          {item.likes}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
