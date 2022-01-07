import "./SearchItem.scss";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";

const SearchItem = ({ item }) => {
  const history = useHistory();

  const handlePostClick = () => {
    history.push("/post/@" + item.user.userId + "/" + item.url);
  };

  return (
    <div className="search-item">
      <div className="user-info">
        <img className="user-profile" src={item.user.image} alt="저자 이미지" />
        <div className="user-name">{item.user.userId}</div>
      </div>
      {item.thumbnail === null || item.thumbnail === "" ? (
        <div />
      ) : (
        <div className="thumbnail" onClick={handlePostClick}>
          <img className="thumbnail-img" src={item.thumbnail} alt="썸네일" />
        </div>
      )}
      <div className="post-mainsection" onClick={handlePostClick}>
        <div className="title">{item.title}</div>
        <div className="summary">{item.summary}</div>
        <div className="tags"></div>
        <div className="sub-info">
          {dayjs(item.createAt).format("YYYY년 MM월 DD일")} · {item.comments}
          개의 댓글
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
