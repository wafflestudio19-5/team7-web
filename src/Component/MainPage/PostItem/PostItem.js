import "./PostItem.scss";

const PostItem = ({item}) => {

    return (
        <div className="PostItem">
            <div className={"PostPhotoSection"}>
                <img className={"PostPhoto"} src={item.postImg} alt={"포스트 이미지"}/>
            </div>
            <div className={"PostMainSection"}>
                <h4 className={"PostTitle"}>{item.title}</h4>
                <p className={"PostSummary"}>{item.summary}</p>
                <p className={"PostSubInfo"}>{item.date} · {item.comments}개의 댓글</p>
            </div>
            <div className={"PostSubSection"}>
                <a className={"PostAuthorInfo"}>
                    <img className={"PostAuthorImg"} src={item.authorImg} alt={"저자 이미지"}/>
                    <span className={"PostAuthorName"}>by <b>{item.author}</b></span>
                </a>

                <div className={"Likes"}>
                    <svg className={"HeartIcon"} width="24" height="24" viewBox="0 0 24 24" >
                        <path className={"HeartPath"}/>
                    </svg>
                    {item.likes}
                </div>

            </div>



        </div>
    );
};

export default PostItem;
