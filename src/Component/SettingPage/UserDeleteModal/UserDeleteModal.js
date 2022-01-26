import Modal from 'react-modal';
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import './UserDeleteModal.scss';
import {toast} from 'react-toastify';
import { useSessionContext } from "../../../Context/SessionContext";
import dayjs from "dayjs";

const UserDeleteModal = ({ isDeleteOpen, setIsDeleteOpen } ) => {

    Modal.setAppElement('#root');

    const params = useParams();
    const history = useHistory();
    const { token, handleLogout } = useSessionContext();

    const handleCancel = () => {
        setIsDeleteOpen(false);
    }

    const handleDelete = () => {
        axios
            .delete(
                `/api/v1/user/me`, {
                    headers: {
                        Authentication: token,
                    }
                })
            .then((response) => {
                console.log(response);
                history.push("");
                handleLogout();
                toast.success("탈퇴를 성공하였습니다.");
                setIsDeleteOpen(false);
                history.push("/");
            })
            .catch((error) => {
                console.log(error.response);
                 toast.error("탈퇴 오류");
            });
    }

    return(
        <Modal className="comments-delete-modal" isOpen={isDeleteOpen} onRequestClose={() => setIsDeleteOpen(false)}>
            <div className="comments-delete-modal-box">
                <h3 className="comments-delete-modal-title">
                    계정 탈퇴
                </h3>

                <div className="comments-delete-modal-message">
                    계정을 정말로 탈퇴하시겠습니까?
                </div>

                <div className="comments-delete-modal-button-area">
                    <button className="comments-delete-modal-button-cancel" onClick={handleCancel}>
                        취소
                    </button>
                    <button className="comments-delete-modal-button-delete" onClick={handleDelete}>
                        탈퇴
                    </button>

                </div>

            </div>

        </Modal>
    )
}

export default UserDeleteModal;