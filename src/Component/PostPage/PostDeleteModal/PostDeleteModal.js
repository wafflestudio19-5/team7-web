import Modal from 'react-modal';
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import './PostDeleteModal.scss';
import { toast } from 'react-toastify';
import { useSessionContext } from "../../../Context/SessionContext";

const PostDeleteModal = ( { isPostDeleteOpen, setIsPostDeleteOpen, postUrl } ) => {

    Modal.setAppElement('#root');

    const params = useParams();
    const history = useHistory();
    const { token } = useSessionContext();

    const handleCancel = () => {
        setIsPostDeleteOpen(false);
    }

    const handleDelete = () => {
        axios
            .delete(
                `/api/v1/post?url=${postUrl}`,
                {
                    headers: {
                        Authentication: token,
                    }
                }
            )
            .then((response) => {
                setIsPostDeleteOpen(false);
                history.push(`/`);
                toast.success("게시글이 삭제되었습니다.");
            })
            .catch((error) => {
                toast.error("게시글 삭제 오류");
            });
    }

    return(
        <Modal className="post-delete-modal" isOpen={isPostDeleteOpen} onRequestClose={() => setIsPostDeleteOpen(false)}>
            <div className="post-delete-modal-box">
                <h3 className="post-delete-modal-title">
                    게시글 삭제
                </h3>

                <div className="post-delete-modal-message">
                    게시글을 정말로 삭제하시겠습니까?
                </div>

                <div className="post-delete-modal-button-area">
                    <button className="post-delete-modal-button-cancel" onClick={handleCancel}>
                        취소
                    </button>
                    <button className="post-delete-modal-button-delete" onClick={handleDelete}>
                        삭제
                    </button>

                </div>

            </div>

        </Modal>
    )
}

export default PostDeleteModal;