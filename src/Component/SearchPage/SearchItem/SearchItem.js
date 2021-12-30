import './SearchItem.scss';

const SearchItem = ({item}) => {

    return(
        <div className="search-item">
            <div className="user-info">
                <img className="user-profile" src={`i.${item.user.image}.jpg`} alt="저자 이미지"/>
                <div className="user-name">{item.user.username}</div>
            </div>
            <div className="thumbnail">
                <img className="thumbnail-img" src={`${item.thumbnail}/200.jpg`} alt="썸네일"/>
            </div>
            <div className="title">{item.title}</div>
            <div className="summary">{item.summary}</div>
            <div className="tags"></div>
            <div className="sub-info">{item.createAt} · {item.comments}개의 댓글</div>
        </div>
    )
}

export default SearchItem;