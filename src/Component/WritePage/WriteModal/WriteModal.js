import {useState} from "react";
import Modal from 'react-modal';
import './WriteModal.scss';
import { BsImage, BsFileEarmarkLock } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";

const WriteModal = ( props ) => {

    const {isOpen, setIsOpen, title, contents} = props;

    const [summaryIn, setSummaryIn] = useState("");
    const [summaryOver, setSummaryOver] = useState(false);
    const [isPublic, setIsPublic] = useState(true);

    const handleSummaryIn = (e) => {
        if (e.target.value.length <= 150) {
            setSummaryIn(e.target.value);
            setSummaryOver(false);
        }
        else{
            const cut = e.target.value.substr(0,150);
            setSummaryIn(cut);
            setSummaryOver(true);
        }
    }

    const handlePublic = () => {
        setIsPublic(true);
    }
    const handlePrivate = () => {
        setIsPublic(false);
    }
    const handleCancle = () => {
        setIsOpen(false);
    }
    const handleSubmit = () => {
        window.alert(contents);
    }

    Modal.setAppElement('#root');

    return(
        <Modal className="login-modal" isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <div className="left-box">
                <h2 className="preview-title">포스트 미리보기</h2>
                <div className="thumbnail-box">
                    <BsImage className="thumbnail-icon"/>
                    <button className="upload-btn">업로드</button>
                </div>
                <textarea className="summary-box" placeholder="당신의 포스트를 짧게 소개해보세요." value={summaryIn} onChange={handleSummaryIn}/>
                <div className={`text-num ${summaryOver ? 'over' : ''}`}>{summaryIn.length}/150</div>
            </div>
            <div className="line-center"></div>
            <div className="right-box">
                <h2 className="open-title">공개설정</h2>
                <div className="set-box">
                    <button className={`public-btn ${isPublic ? '' : 'not'}`} onClick={handlePublic}>
                        <GoGlobe className="public-icon"/>
                        전체 공개
                    </button>
                    <button className={`private-btn ${isPublic ? 'not' : ''}`} onClick={handlePrivate}>
                        <BsFileEarmarkLock className="private-icon"/>
                        비공개
                    </button>
                </div>
                <h2 className="url-title">URL 설정</h2>
                <div className="url-box">
                    <div className="username-box">/@{title}/</div>
                    <input className="url-input"/>
                </div>
                <div className="btn-box">
                    <button className="btn-cancle" onClick={handleCancle}>취소</button>
                    <button className="btn-submit" onClick={handleSubmit}>출간하기</button>
                </div>
            </div>
        </Modal>
    )
}

export default WriteModal;