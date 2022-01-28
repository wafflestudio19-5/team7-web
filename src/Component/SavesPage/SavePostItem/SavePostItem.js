import "./SavePostItem.scss";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
import {useSessionContext} from "../../../Context/SessionContext";

const SavePostItem = ({ item, setUpdateSavePost }) => {
    const history = useHistory();

    const { token } = useSessionContext();

    const handlePostClick = () => {
        axios
            .get(`api/v1/save?id=${item.token}`, {
                headers: {
                    Authentication: token
                },
            })
            .then((response) => {
                localStorage.setItem("tempContent", response.data.content);
                history.push("/save/" + item.token);
            })
            .catch((error) => {
                console.log(error);
                history.push("/error"); // 백엔드 404 response 필요!!
            });
    };

    const handleDelete = () => {
        axios
            .delete(
                `/api/v1/save?id=${item.token}`,
                {
                    headers: {
                        Authentication: token
                    }
                }
            )
            .then((response) => {
                toast.success("임시 글이 삭제되었습니다.");
                setUpdateSavePost(dayjs());
            })
            .catch((error) => {
                toast.error("임시 글 삭제 오류");
            });
    }

    return (
        <div className="search-item">
            {/*<a className="search-user-info-href" href={"/@" + item.user.userId}>*/}
            {/*    <div className="user-info">*/}
            {/*        <img*/}
            {/*            className="user-profile"*/}
            {/*            src={item.user.image}*/}
            {/*            alt="저자 이미지"*/}
            {/*        />*/}
            {/*        <div className="user-name">{item.user.userId}</div>*/}
            {/*    </div>*/}
            {/*</a>*/}
            {/*{item.thumbnail === null || item.thumbnail === "" ? (*/}
            {/*    <div />*/}
            {/*) : (*/}
            {/*    <div className="thumbnail" onClick={handlePostClick}>*/}
            {/*        <img className="thumbnail-img" src={item.thumbnail} alt="썸네일" />*/}
            {/*    </div>*/}
            {/*)}*/}
            <div className="post-mainsection" onClick={handlePostClick}>
                <div className="title">{item.title}</div>
                <div className="summary">{item.shortContent}</div>

                {/*<div className="tags">*/}
                {/*    {(item.tags).map((elements) => (*/}
                {/*        <a className="tags-contents" href={`/tag/${elements.url}`} key={elements.id}>*/}
                {/*            {elements.name}*/}
                {/*        </a>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>

            <div className="sub-info">
                {dayjs(item.createAt).format("YYYY년 MM월 DD일")}
                <button className={"save-post-delete-button"} onClick={handleDelete}>삭제</button>
            </div>
        </div>
    );
};

export default SavePostItem;
