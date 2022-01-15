import Modal from 'react-modal';
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import './CommentsDeleteModal.scss';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSessionContext } from "../../../Context/SessionContext";
import dayjs from "dayjs";

const PostDeleteModal = ( { isPostDeleteOpen, setIsPostDeleteOpen, postId } ) => {

    Modal.setAppElement('#root');

    const params = useParams();
    const history = useHistory();
    const { token } = useSessionContext();

    const handleCancel = () => {
        setIsPostDeleteOpen(false);
    }

    const handleDelete = () => {
        // axios
        //     .delete(
        //         `/api/v1/post/${postId}/comment/${targetCommentId}`,
        //         {
        //             headers: {
        //                 Authentication: token,
        //             }
        //         }
        //     )
        //     .then((response) => {
        //         // setCommentsCount(response.data.count);
        //         // setCommentsList(response.data.contents);
        //         setUpdateComment(dayjs());
        //         setIsDeleteOpen(false);
        //         // history.push(`/post/@${params.userId}/${params.postUrl}`);
        //         console.log(`/post/@${params.userId}/${params.postUrl}`);
        //         toast.success("게시글이 삭제되었습니다.");
        //     })
        //     .catch((error) => {
        //         toast.error("게시 삭제 오류");
        //     });
    }

    return(
        <Modal className="comments-delete-modal" isOpen={isPostDeleteOpen} onRequestClose={() => setIsPostDeleteOpen(false)}>
            <ToastContainer/>
            <div className="comments-delete-modal-box">
                <h3 className="comments-delete-modal-title">
                    게시글 삭제
                </h3>

                <div className="comments-delete-modal-message">
                    게시글을 정말로 삭제하시겠습니까?
                </div>

                <div className="comments-delete-modal-button-area">
                    <button className="comments-delete-modal-button-cancel" onClick={handleCancel}>
                        취소
                    </button>
                    <button className="comments-delete-modal-button-delete" onClick={handleDelete}>
                        삭제
                    </button>

                </div>

            </div>

        </Modal>
    )
}

export default CommentsDeleteModal;