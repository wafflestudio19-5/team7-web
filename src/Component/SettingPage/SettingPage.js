import Header from "../MainPage/Header/Header";
import { useHistory } from "react-router-dom";
import { useSessionContext } from "../../Context/SessionContext";
import './SettingPage.scss';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

const SettingPage = () => {

    const { handleLogout, id, isLogin, userId, token } = useSessionContext();
    const history = useHistory();

    const userImgInput = useRef({});

    const [userImg, setUserImg] = useState("");
    const [userName, setUserName] = useState("");
    const [userShort, setUserShort] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const [thumbImgBase64, setThumbImgBase64] = useState(""); // 파일 base64
    const [thumbImgFile, setThumbImgFile] = useState(null); //파일
    const [thumbUrl, setThumbUrl] = useState("");

    const handleReturnHome = () => {
        history.push("");
    };
    const handleUserImg = (event) => {
        const reader = new FileReader();
        const formData = new FormData();

        reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result;
            if (base64) {
                setThumbImgBase64(base64.toString()); // 파일 base64 상태 업데이트
            }
        };
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
            setThumbImgFile(event.target.files[0]); // 파일 상태 업데이트
            console.log(event.target.files[0]);
            formData.append('image',event.target.files[0]);
        }

        axios.post(`/api/v1/image`,
            formData
            ,{
                headers: {
                    Authentication: token,
                    'Content-Type': 'multipart/form-data'
                },
            })
            .then((res) => {
                setThumbUrl(res.data.url);
                toast.success("프로필 업로드에 성공했습니다.", {
                    autoClose: 3000,
                });
                console.log(res.data);
            })
            .catch((error) => {
                toast.error("프로필 업로드에 실패했습니다.", {
                    autoClose: 3000,
                });
                setThumbImgBase64("");
                setThumbImgFile(null);
                setThumbUrl("");
                console.log(error);
            });

        axios.put(`/api/v1/image`,{
            image: thumbUrl
        },{
            headers: {
                Authentication: token,
                'Content-Type': 'multipart/form-data'
            },
        })
    };
    const handleUserImgChange = (e) => {
        e.preventDefault();
        userImgInput.current.click();
    };

    const handleDeleteThumb = () => {
        axios
            .delete(`/api/v1/user/image`, {
                headers: {
                    Authentication: token,
                },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleResign = () => {

    }

    const setSetting = (image, name, short, email) => {
        setUserImg(image);
        setUserName(name);
        setUserShort(short);
        setUserEmail(email);
    }

    useEffect(() => {
        axios
            .get(`/api/v1/user/setting`, {
                headers: {
                    Authentication: token,
                },
            })
            .then((response) => {
                setSetting(response.data.image, response.data.name, response.data.shortIntro, response.data.publicEmail);
            })
            .catch((error) => {
                console.log(error);
            });
    })

    return(
        <div className="contents">
            {isLogin ?
                <div className="setting-page">
                    <Header />
                    <div className="main">
                        <div className="info">
                            <div className="thumbnail-area">
                                <img src={userImg} alt="" className="thumbnail-box"/>
                                <button className="upload-btn" onClick={handleUserImgChange}>이미지 업로드</button>
                                <input
                                    className="upload-input"
                                    type="file"
                                    accept="image/*"
                                    ref={userImgInput}
                                    onChange={handleUserImg}
                                    name="thumbImgFile"
                                    id="thumbImgFile"
                                />
                                <button className="delete-btn" onClick={handleDeleteThumb}>이미지 제거</button>
                            </div>
                            <div className="info-area">
                                <h2>{userName}</h2>
                                <p>{userShort}</p>
                                <button className="insert">수정</button>
                            </div>
                        </div>
                        <div className="custom">
                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">벨로그 제목</div>
                                    <div className="list-info">{userId}</div>
                                </div>
                                <div className="explanation">개인 페이지의 좌측 상단에 나타나는 페이지 제목입니다.</div>
                            </div>
                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">이메일 주소</div>
                                    <div className="list-info">{userEmail}</div>
                                </div>
                                <div className="explanation">회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다.</div>
                            </div>
                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">회원 탈퇴</div>
                                    <div className="list-info">
                                        <button className="resign-btn" onClick={handleResign}>회원 탈퇴</button>
                                    </div>
                                </div>
                                <div className="explanation">탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.</div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="errorpage">
                    <img
                        className="error-image"
                        src="https://static.velog.io/static/media/undraw_page_not_found_su7k.7e3de5e9.svg"
                        alt="error"
                    />
                    <div className={"text-nothing"}>로그인 이후 이용해주세요!</div>
                    <button className={"btn-returnhome"} onClick={handleReturnHome}>
                        홈으로
                    </button>
                </div>
            }
        </div>
    )
};

export default SettingPage;