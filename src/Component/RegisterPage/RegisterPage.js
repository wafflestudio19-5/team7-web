import "./RegisterPage.scss";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSessionContext } from "../../Context/SessionContext";

const RegisterPage = () => {
  const params = useParams();
  const history = useHistory();
  const URLSearch = new URLSearchParams(window.location.search);

  const { handleLogin } = useSessionContext();

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerId, setRegisterId] = useState("");
  const [registerIntro, setRegisterIntro] = useState("");
  const [registerError, setRegisterError] = useState(0);
  const [registerToken, setRegisterToken] = useState("");

  useEffect(() => {
    setRegisterEmail(URLSearch.get("email"));
    setRegisterToken(URLSearch.get("token"));

    axios
      .post(`/api/v1/auth/verify`, {
        email: URLSearch.get("email"),
        token: URLSearch.get("token"),
      })
      .then((response) => {})
      .catch((error) => {
        history.push("/");
        toast.error("잘못된 접근입니다.");
      });
  }, []);

  const handleCancel = () => {
    history.push("/");
  };

  const handleComplete = (e) => {
    const spacePattern = /\s/g; // 공백
    const specialPattern = /[~!@#$%^&*()+|<>?:{}]/; // 특수문자
    const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글

    if (registerName === "") {
      setRegisterError(1);
    } else if (
      registerId.match(spacePattern) ||
      registerId.match(specialPattern) ||
      registerId.match(koreanPattern) ||
      registerId.length < 3 ||
      registerId.length > 16
    ) {
      setRegisterError(2);
    } else {
      axios
        .post(`/api/v1/auth/user/info`, {
          email: registerEmail,
          name: registerName,
          userId: registerId,
          shortIntro: registerIntro,
          token: registerToken,
        })
        .then((response) => {
          handleLogin(
            response.data.user.id,
            response.data.user.userId,
            response.data.user.image,
            response.data.token
          );
          toast.success("회원가입이 완료되었습니다.");
          history.push("/");
        })
        .catch((error) => {
          console.log(error.response);

          if (error.response.data.errorCode === 9011) {
            setRegisterError(3);
          }
          else {
            setRegisterError(4);
          }
        });
    }
  };

  return (
    <div className="registerpage">
      <div className="register-section">
        <h1 className="register-welcome">환영합니다!</h1>
        <div className="register-description">
          기본 회원 정보를 등록해주세요.
        </div>

        <div className="register-detail-section">
          <div className="register-detail-block">
            <label className="register-detail-text">이름</label>
            <div className="register-detail-input">
              <div className="register-detail-input-wrapper">
                <input
                  className="register-detail-input-inputbox"
                  placeholder="이름을 입력하세요"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="register-detail-block">
            <label className="register-detail-text">이메일</label>
            <div className="register-detail-input">
              <div className="register-detail-input-wrapper">
                <input
                  className="register-detail-input-inputbox"
                  placeholder={registerEmail}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="register-detail-block">
            <label className="register-detail-text">아이디</label>
            <div className="register-detail-input">
              <div className="register-detail-input-wrapper">
                <input
                  className="register-detail-input-inputbox"
                  placeholder="아이디를 입력하세요"
                  value={registerId}
                  onChange={(e) => setRegisterId(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="register-detail-block">
            <label className="register-detail-text">한 줄 소개</label>
            <div className="register-detail-input">
              <div className="register-detail-input-wrapper">
                <input
                  className="register-detail-input-inputbox"
                  placeholder="당신을 한 줄로 소개해보세요"
                  value={registerIntro}
                  onChange={(e) => setRegisterIntro(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="register-error-section">
          {registerError === 0
            ? ""
            : registerError === 1
            ? "이름을 입력해주세요."
            : registerError === 2
            ? "아이디는 3~16자의 알파벳,숫자,혹은 - _ 으로 이루어져야 합니다."
            : registerError === 3
            ? "이미 존재하는 아이디입니다."
            : "에러 발생!"}
        </div>

        <div className="register-button-section">
          <button className="register-btn-cancel" onClick={handleCancel}>
            취소
          </button>
          <button className="register-btn-complete" onClick={handleComplete}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
