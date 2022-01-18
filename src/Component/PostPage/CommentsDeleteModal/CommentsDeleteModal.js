import Modal from 'react-modal';
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import './CommentsDeleteModal.scss';
import {toast} from 'react-toastify';
import { useSessionContext } from "../../../Context/SessionContext";
import dayjs from "dayjs";

const CommentsDeleteModal = ( { isDeleteOpen, setIsDeleteOpen, postId, targetCommentId, setCommentsCount, setCommentsList, setUpdateComment } ) => {

    Modal.setAppElement('#root');

    const params = useParams();
    const history = useHistory();
    const { token } = useSessionContext();

    const handleCancel = () => {
        setIsDeleteOpen(false);
    }

    const handleDelete = () => {
        axios
            .delete(
                `/api/v1/post/${postId}/comment/${targetCommentId}`,
                {
                    headers: {
                        Authentication: token,
                    }
                }
            )
            .then((response) => {
                // setCommentsCount(response.data.count);
                // setCommentsList(response.data.contents);
                setUpdateComment(dayjs());
                setIsDeleteOpen(false);
                // history.push(`/post/@${params.userId}/${params.postUrl}`);
                console.log(`/post/@${params.userId}/${params.postUrl}`);
                toast.success("댓글이 삭제되었습니다.");
            })
            .catch((error) => {
                 toast.error("댓글 삭제 오류");
            });
    }

    return(
        <Modal className="comments-delete-modal" isOpen={isDeleteOpen} onRequestClose={() => setIsDeleteOpen(false)}>
            <div className="comments-delete-modal-box">
                <h3 className="comments-delete-modal-title">
                    댓글 삭제
                </h3>

                <div className="comments-delete-modal-message">
                    댓글을 정말로 삭제하시겠습니까?
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