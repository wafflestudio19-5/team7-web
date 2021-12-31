import './SearchItem.scss';
import dayjs from "dayjs";

const SearchItem = ({item}) => {

    return(
        <div className="search-item">
            <div className="user-info">
                <img className="user-profile" src={item.user.image} alt="저자 이미지"/>
                <div className="user-name">{item.user.username}</div>
            </div>
            <div className="thumbnail">
                <img className="thumbnail-img" src={item.thumbnail} alt="썸네일"/>
            </div>
            <div className="post-mainsection">
                <div className="title">{item.title}</div>
                <div className="summary">{item.summary}</div>
                <div className="tags"></div>
                <div className="sub-info">{dayjs(item.createdAt).format("YYYY년 MM월 DD일")} · {item.comments}개의 댓글</div>
            </div>
        </div>
    )
}

export default SearchItem;