import Modal from 'react-modal';
import axios from "axios";
import { useHistory } from "react-router-dom";
import './CommentsDeleteModal.scss';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSessionContext } from "../../../Context/SessionContext";

const CommentsDeleteModal = ( { isOpen, setIsOpen, postId, targetCommentId, setCommentsCount, setCommentsList } ) => {

    Modal.setAppElement('#root');

    const history = useHistory();
    const { token } = useSessionContext();

    const handleCancel = () => {
        setIsOpen(false);
    }

    const handleDelete = () => {
        axios
            .delete(
                `https://waflog.kro.kr/api/v1/post/${postId}/comment/${targetCommentId}`,
                {
                    headers: {
                        Authentication: token,
                    }
                }
            )
            .then((response) => {
                // console.log(response);
                // setCommentsCount(response.data.count);
                // setCommentsList(response.data.contents);
                setIsOpen(false);
                toast.success("댓글이 삭제되었습니다.");
                history.replace("./");
            })
            .catch((error) => {
                 toast.error("댓글 삭제 오류");
            });
    }

    return(
        <Modal className="comments-delete-modal" isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <ToastContainer/>
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