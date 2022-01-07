import Header from "../MainPage/Header/Header";
import { useHistory } from "react-router-dom";
import { useSessionContext } from "../../Context/SessionContext";
import './SettingPage.scss';

const SettingPage = () => {

    const { handleLogout, id, isLogin, userId, userImg } = useSessionContext();
    const history = useHistory();

    const handleReturnHome = () => {
        history.push("");
    };

    return(
        <div className="contents">
            {isLogin ?
                <div className="setting-page">
                    <Header />
                    <div className="main">
                        <div className="info">
                            <div className="thumbnail-area">
                                <img src={userImg} alt="" className="thumbnail-box"/>
                                <button className="upload-btn">이미지 업로드</button>
                                <button className="delete-btn">이미지 제거</button>
                            </div>
                            <div className="info-area">
                                <h2>{userId}(name)</h2>
                                <p>한 줄 소개</p>
                                <button className="insert">수정</button>
                            </div>
                        </div>
                        <div className="custom">
                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">벨로그 제목</div>
                                    <div className="list-info">{userid}</div>
                                </div>
                                <div className="explanation">개인 페이지의 좌측 상단에 나타나는 페이지 제목입니다.</div>
                            </div>
                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">이메일 주소</div>
                                    <div className="list-info">{userId + "@"}</div>
                                </div>
                                <div className="explanation">회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다.</div>
                            </div>
                            <div className="custom-list">
                                <div className="list-style">
                                    <div className="list-title">회원 탈퇴</div>
                                    <div className="list-info">
                                        <button className="resign-btn">회원 탈퇴</button>
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