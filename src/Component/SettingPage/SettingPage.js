import Header from "../MainPage/Header/Header";
import { useHistory } from "react-router-dom";
import { useSessionContext } from "../../Context/SessionContext";
import './SettingPage.scss';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import { AiTwotoneMail, AiOutlineGithub, AiOutlineTwitter, AiFillFacebook, AiFillHome } from "react-icons/ai";
import UserDeleteModal from "./UserDeleteModal/UserDeleteModal";

const SettingPage = () => {

    const { handleLogout, id, isLogin, userId, token, setUserImg } = useSessionContext();
    const history = useHistory();

    const userImgInput = useRef({});

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [userImg, setUserCImg] = useState("");
    const [userName, setUserName] = useState("testName");
    const [userShort, setUserShort] = useState("");
    const [userPageTitle, setUserPageTitle] = useState("");

    const [inTitle, setInTitle] = useState(false);
    const [newUserPageTitle, setNewUserPageTitle] = useState("");

    const [inSocial, setInSocial] = useState(false);
    const [eE,setEE] = useState(false);
    const [eG,setEG] = useState(false);
    const [eF,setEF] = useState(false);
    const [eT,setET] = useState(false);
    const [eH,setEH] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userGit, setUserGit] = useState("");
    const [userFace, setUserFace] = useState("");
    const [userTwit, setUserTwit] = useState("");
    const [userHome, setUserHome] = useState("");
    const [userAccountEmail, setUserAccountEmail] = useState("");
    const [userNotification, setUserNotification] = useState(false);

    const [writeShort, setWriteShort] = useState(false);

    const [thumbImgBase64, setThumbImgBase64] = useState(""); // 파일 base64
    const [thumbImgFile, setThumbImgFile] = useState(null); //파일
    const [thumbUrl, setThumbUrl] = useState("");

    const setSetting = (image, name, short, pageTitle, email, home, g, f, t, aEmail) => {
        setUserCImg(image);
        setUserName(name);
        setUserShort(short);
        setUserPageTitle(pageTitle);
        setNewUserPageTitle(pageTitle);
        setUserEmail(email);
        setUserHome(home);
        setUserGit(g);
        setUserFace(f);
        setUserTwit(t);
        setUserAccountEmail(aEmail);

        if(email !== null && email !== "" && email.length !== 0){
            setEE(true);
        }
        else{
            setEE(false);
        }
        if(g !== null && g !== ""){
            setEG(true);
        }
        else{
            setEG(false);
        }
        if(f !== null && f !== ""){
            setEF(true);
        }
        else{
            setEF(false);
        }
        if(t !== null && t !== ""){
            setET(true);
        }
        else{
            setET(false);
        }
        if(home !== null && home !== ""){
            setEH(true);
        }
        else{
            setEH(false);
        }
    }

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
                //console.log(response.data);
                toast.success("프로필 업로드에 성공했습니다.", {
                    autoClose: 3000,
                });

                console.log(res.data.url);

                axios.put(`/api/v1/user/image`,{
                    image: res.data.url
                },{
                    headers: {
                        Authentication: token,
                    },
                })
                    .then((response) => {
                        toast.success("프로필 변경에 성공했습니다.", {
                            autoClose: 3000,
                        });
                        setUserCImg(response.data.image);
                        setUserImg(response.data.image);
                        localStorage.setItem("userImg", response.data.image);
                        console.log(response.data);
                    })
                    .catch((error) => {
                        toast.error("프로필 변경에 실패했습니다.", {
                            autoClose: 3000,
                        });
                        console.log(error);
                    });

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
                toast.success("삭제를 성공했습니다.", {
                    autoClose: 3000,
                });
                setUserCImg(response.data.image);
                setUserImg(response.data.image);
                localStorage.setItem("userImg", response.data.image);
                console.log(response);
            })
            .catch((error) => {
                toast.error("삭제를 실패했습니다.", {
                    autoClose: 3000,
                });
                console.log(error);
            });
    }
    const handleWriteShort = () => {
        setWriteShort(true);
    }
    const handleSaveShort = () => {

        axios
            .put(`/api/v1/user/profile`,{
                name: userName,
                shortIntro: userShort
            },{
                headers: {
                    Authentication: token,
                },
            })
            .then((response) => {
                toast.success("저장을 성공했습니다.", {
                    autoClose: 3000,
                });
                console.log(response);
                setUserName(response.data.name);
                setUserShort(response.data.shortIntro);
            })
            .catch((error) => {
                toast.error("저장을 실패했습니다.", {
                    autoClose: 3000,
                });
                console.log(error);
            });
        setWriteShort(false);
    }
    const handleUserShort = (e) => {
        setUserShort(e.target.value);
    }
    const handleUserName = (e) => {
        setUserName(e.target.value);
    }

    const handleSaveTitle = () => {
        axios
            .put(`/api/v1/user/title`,{
                    title: newUserPageTitle
                },{
                    headers: {
                        Authentication: token,
                    },
                })
            .then((response) => {
                console.log(response.data);
                setUserPageTitle(newUserPageTitle);
                setInTitle(false);
                toast.success("페이지 제목이 변경되었습니다.", {
                    autoClose: 3000,
                });
            })
            .catch((error) => {
                toast.error("변경을 실패했습니다.", {
                    autoClose: 3000,
                });
                console.log(error);
            });
    }


    const handleInSocial = () => {
        setInSocial(true);
    }
    const handleEmail = (e) => {
        setUserEmail(e.target.value);
    }
    const handleTwit = (e) => {
        setUserTwit(e.target.value);
    }
    const handleGit = (e) => {
        setUserGit(e.target.value);
    }
    const handleFace = (e) => {
        setUserFace(e.target.value);
    }
    const handleHome = (e) => {
        setUserHome(e.target.value);
    }
    const handleSaveSocial = () => {

        const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

        if(!userEmail.match(regExp) && (userEmail !== "")){
            toast.error("올바르지 않은 이메일 형식입니다.", {
                autoClose: 3000,
            });
            return;
        }

        axios
            .put(`/api/v1/user/social`,{
                    publicEmail : userEmail,
                    githubId : userGit,
                    facebookId : userFace,
                    twitterId : userTwit,
                    homepage : userHome,
                }
                ,{
                headers: {
                    Authentication: token,
                },
            })
            .then((response) => {
                console.log(response.data);
                // toast.success("저장중입니다.", {
                //     autoClose: 3000,
                // });

                axios
                    .get(`/api/v1/user/setting`, {
                        headers: {
                            Authentication: token,
                        },
                    })
                    .then((response) => {
                        toast.success("저장을 성공했습니다.", {
                            autoClose: 3000,
                        });
                        setSetting(response.data.image, response.data.name, response.data.shortIntro, response.data.pageTitle, response.data.publicEmail, response.data.homepage, response.data.githubId, response.data.facebookId, response.data.twitterId, response.data.email);
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                toast.error("저장을 실패했습니다.", {
                    autoClose: 3000,
                });
                console.log(error);
            });

        setInSocial(false);
    }



    const handleResign = () => {
        setIsDeleteOpen(true);
    }

    const handleOn = () => {
        axios
            .put(`/api/v1/user/commentNotification`,{
                    commentNotification : false
                }
                ,{
                    headers: {
                        Authentication: token,
                    },
                })
            .then((response) => {
                console.log(response.data);
                toast.success("저장을 성공했습니다.", {
                    autoClose: 3000,
                });
                setUserNotification(false);

            })
            .catch((error) => {
                toast.error("저장을 실패했습니다.", {
                    autoClose: 3000,
                });
                console.log(error);
            });
    }

    const handleOff = () => {
        axios
            .put(`/api/v1/user/commentNotification`,{
                    commentNotification : true
                }
                ,{
                    headers: {
                        Authentication: token,
                    },
                })
            .then((response) => {
                console.log(response.data);
                toast.success("저장을 성공했습니다.", {
                    autoClose: 3000,
                });
                setUserNotification(true);

            })
            .catch((error) => {
                toast.error("저장을 실패했습니다.", {
                    autoClose: 3000,
                });
                console.log(error);
            });
    }

    useEffect(() => {
        axios
            .get(`/api/v1/user/setting`, {
                headers: {
                    Authentication: token,
                },
            })
            .then((response) => {
                setSetting(response.data.image, response.data.name, response.data.shortIntro, response.data.pageTitle, response.data.publicEmail, response.data.homepage, response.data.githubId, response.data.facebookId, response.data.twitterId, response.data.email);
                setUserNotification(response.data.commentNotification);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    },[]);

    return(
        <div className="contents">
            <ToastContainer />
            {isLogin ?
                <div className="setting-page">
                    <Header pageTitle={"Waflog"} />
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
                            {writeShort ?
                                <div className="info-area">
                                    <input placeholder="이름" className="write-name" value={userName} onChange={handleUserName}/>
                                    <input placeholder="한 줄 소개" className="write-short" value={userShort} onChange={handleUserShort}/>
                                    <button className="write" onClick={handleSaveShort}>저장</button>
                                </div>
                                :
                                <div className="info-area">
                                    <h2>{userName}</h2>
                                    <p>{userShort}</p>
                                    <button className="insert" onClick={handleWriteShort}>수정</button>
                                </div>
                            }

                        </div>
                        <div className="custom">
                            <div className="custom-list">

                                {!inTitle ? (
                                    <>
                                        <div className="list-style">
                                            <div className="list-title">와플로그 제목</div>
                                            <div className="list-info">{userPageTitle}</div>
                                        </div>
                                        <div className="explanation">개인 페이지의 좌측 상단에 나타나는 페이지 제목입니다.</div>
                                        <div  className="title-btn-wrapper">
                                            <button className="title-save" onClick={()=>setInTitle(true)}>수정</button>
                                        </div>
                                    </>
                                    )
                                    :(
                                        <>
                                            <div className="list-style">
                                                <div className="list-title">와플로그 제목</div>
                                                <input className="title-input" placeholder="페이지 제목을 입력하세요." value={newUserPageTitle} onChange={(e) => setNewUserPageTitle(e.target.value)}/>
                                            </div>
                                            <div className="explanation">개인 페이지의 좌측 상단에 나타나는 페이지 제목입니다.</div>

                                            <div  className="title-btn-wrapper">
                                                <button className="title-cancel" onClick={()=>setInTitle(false)}>취소</button>
                                                <button className="title-save" onClick={handleSaveTitle}>저장</button>
                                            </div>
                                        </>)}
                            </div>
                            {inSocial ?
                                <div className="custom-list">
                                    <div className="wrapper">
                                        <div className="title-wrapper">
                                            <div className="list-title">소셜 정보</div>
                                        </div>
                                        <div className="info-block">
                                            <div className="contents">
                                                <div className="social-form">
                                                    <div className="social-list">
                                                        <AiTwotoneMail className="social-icon"/>
                                                        <input className="social-input" placeholder="이메일을 입력하세요." value={userEmail} onChange={handleEmail}/>
                                                    </div>
                                                    <div className="social-list">
                                                        <AiOutlineGithub className="social-icon"/>
                                                        <input className="social-input" placeholder="Github 계정을 입력하세요." value={userGit} onChange={handleGit}/>
                                                    </div>
                                                    <div className="social-list">
                                                        <AiOutlineTwitter className="social-icon"/>
                                                        <input className="social-input" placeholder="Twitter 계정을 입력하세요" value={userTwit} onChange={handleTwit}/>
                                                    </div>
                                                    <div className="social-list">
                                                        <AiFillFacebook className="social-icon"/>
                                                        <div className="facebook-div">
                                                            <span>https://www.facebook.com/</span>
                                                            <input className="facebook-input" value={userFace} onChange={handleFace}/>
                                                        </div>
                                                    </div>
                                                    <div className="social-list">
                                                        <AiFillHome className="social-icon"/>
                                                        <div className="facebook-div">
                                                            <span>https://</span>
                                                            <input className="social-input" placeholder="홈페이지 주소를 입력하세요. (https:// 제외)" value={userHome} onChange={handleHome}/>
                                                        </div>
                                                    </div>
                                                    <div className="btn-wrapper">
                                                        <button className="social-cancel" onClick={()=>setInSocial(false)}>취소</button>
                                                        <button className="social-save" onClick={handleSaveSocial}>저장</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="custom-list">
                                    <div className="wrapper">
                                        <div className="title-wrapper">
                                            <div className="list-title">소셜 정보</div>
                                        </div>
                                        <div className="info-block">
                                            <div className="contents">
                                                <div className="social-form">
                                                    {eE ?
                                                        <div className="social-list">
                                                            <AiTwotoneMail className="social-icon"/>
                                                            <span>{userEmail}</span>
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                    {eG ?
                                                        <div className="social-list">
                                                            <AiOutlineGithub className="social-icon"/>
                                                            <span>{userGit}</span>
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                    {eT ?
                                                        <div className="social-list">
                                                            <AiOutlineTwitter className="social-icon"/>
                                                            <span>{userTwit}</span>
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                    {eF ?
                                                        <div className="social-list">
                                                            <AiFillFacebook className="social-icon"/>
                                                            <span>{userFace}</span>
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                    {eH ?
                                                        <div className="social-list">
                                                            <AiFillHome className="social-icon"/>
                                                            <span>{userHome}</span>
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                    <div  className="btn-wrapper">
                                                        <button className="social-save" onClick={handleInSocial}>정보 추가</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">이메일 주소</div>
                                    <div className="list-info">{userAccountEmail}</div>
                                </div>
                                <div className="explanation">회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다.</div>
                            </div>
                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">이메일 수신 설정</div>
                                    <li className="list-info-btn">
                                        <span className="list-info-btn-title">댓글 알림</span>
                                        {userNotification ?
                                            <button className="btn-on" onClick={handleOn}>ON</button>
                                            :
                                            <button className="btn-off" onClick={handleOff}>OFF</button>
                                        }
                                    </li>
                                </div>
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
            <UserDeleteModal
                isDeleteOpen={isDeleteOpen}
                setIsDeleteOpen={setIsDeleteOpen}
            />
        </div>
    )
};

export default SettingPage;