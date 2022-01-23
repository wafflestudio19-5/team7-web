import "./UserPost.scss";
import {useHistory, useParams} from "react-router-dom";
import dayjs from "dayjs";

const UserPost = ({ item }) => {
    const params = useParams();
    const URLSearch = new URLSearchParams(window.location.search);
    const history = useHistory();

    const handlePostClick = () => {
        history.push("/post/@" + params.userId + "/" + item.url);
    };

    return (
        <div className="userpost-item">
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
                <div className="tags">
                    {(item.tags).map((elements) => (
                        <a className="tags-contents" href={`/tag/${elements.url}`} key={elements.id}>
                            {elements.name}
                        </a>
                    ))}
                </div>
                <div className="sub-info">
                    {dayjs(item.createAt).format("YYYY년 MM월 DD일")} · {item.comments}
                    개의 댓글
                </div>
            </div>
        </div>
    );
};

export default UserPost;
