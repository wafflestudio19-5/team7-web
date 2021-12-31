import {useState} from "react";
import Modal from 'react-modal';
import './WriteModal.scss';

const WriteModal = ( props ) => {

    const {isOpen, setIsOpen} = props;

    const [emailInput, setEmailInput] = useState("");

    Modal.setAppElement('#root');

    return(
        <Modal className="login-modal" isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <div> 이것저것 필요한거 담을예정 </div>
            <div className="line-center"></div>
        </Modal>
    )
}

export default WriteModal;