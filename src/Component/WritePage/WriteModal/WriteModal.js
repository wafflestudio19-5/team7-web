import {useState, useRef} from "react";
import {useHistory, useParams, useLocation} from "react-router-dom";
import Modal from 'react-modal';
import './WriteModal.scss';
import { BsImage, BsFileEarmarkLock } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import axios from "axios";
import {useSessionContext} from "../../../Context/SessionContext";
import { ToastContainer, toast } from "react-toastify";

const WriteModal = ( props ) => {

    const {handleLogout , isLogin, userId, token} = useSessionContext();
    const {isOpen, setIsOpen, title, contents} = props;
    const history = useHistory();

    const [summaryIn, setSummaryIn] = useState("");
    const [summaryOver, setSummaryOver] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [url, setUrl] = useState("");

    const [thumbImgBase64, setThumbImgBase64] = useState(""); // 파일 base64
    const [thumbImgFile, setThumbImgFile] = useState(null);	//파일

    const handleThumbnailFile = (event) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result;
            if (base64) {
                setThumbImgBase64(base64.toString()); // 파일 base64 상태 업데이트
            }
        }
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
            setThumbImgFile(event.target.files[0]); // 파일 상태 업데이트
            console.log(event.target.files[0]);
        }
    }

    const logoImgInput = useRef({});

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
    const handleUrl = (e) => {
        setUrl(e.target.value);
    }
    const handleCancle = () => {
        setIsOpen(false);
    }
    const handleSubmit = () => {
        axios
            .post(`https://waflog.kro.kr/api/v1/post`,
                {
                    title: title,
                    content: contents,
                    thumbnail: "",
                    summary: summaryIn,
                    private: !isPublic,
                    url: url,
                },
                {
                    headers: {
                        Authentication: token,
                    },
                }
                )
            .then((response) => {
                history.push("");
            })
            .catch((error) => {
                toast.error("로그인이 만료되었습니다.",{
                    autoClose: 3000,
                });
                toast.error("다시 로그인 해주세요.",{
                    autoClose: 3000,
                });
            });
    }
    const handleThumbnail = (e) => {
        e.preventDefault();
        logoImgInput.current.click();
    }

    Modal.setAppElement('#root');

    return(
        <Modal className="login-modal" isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <ToastContainer/>
            <div className="left-box">
                <h2 className="preview-title">포스트 미리보기</h2>
                <div className="thumbnail-box">
                    {thumbImgFile === null ?
                        <BsImage className="thumbnail-icon"/>
                        :
                        <img src={thumbImgBase64} alt={"썸네일"} className="thumbnail-img"/>
                    }
                    <button className="upload-btn" onClick={handleThumbnail}>업로드</button>
                    <input className="upload-input" type="file" accept="image/*" ref={logoImgInput} onChange={handleThumbnailFile} name="thumbImgFile" id="thumbImgFile"/>
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
                    <div className="username-box">/@{userId}/</div>
                    <input className="url-input" value={url} onChange={handleUrl}/>
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