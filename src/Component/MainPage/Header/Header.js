import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Header.scss";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import LoginModal from "../../LoginModal/LoginModal";
import "@fontsource/source-code-pro";
import { useSessionContext } from "../../../Context/SessionContext";

const Header = ({ pageTitle, pageUser }) => {
  const { handleLogout, isLogin, userId, userImg } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState(false);

  const history = useHistory();

  const handleLogin = () => {
    setIsOpen(true);
  };
  const handleSearch = () => {
    history.push("/search");
  };
  const handleWrite = () => {
    history.push("/write");
  };
  const handleLogo = () => {
    history.push("");
  };
  const handlePageTitle = () => {
    history.push("/@"+pageUser);
  };
  const handleLogOut = () => {
    setOption(false);
    handleLogout();
    history.replace("");
  };
  const handleOption = () => {
    setOption(!option);
  };
  const handleSetting = () => {
    history.push("/setting");
    setOption(false);
  }
  const handleWaflog = () => {
    history.push("/@" + userId);
    setOption(false);
  };

  const handleSaves = () => {
    history.push("/saves");
    setOption(false);
  }

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/recent" ||
    window.location.pathname === "/search"
      || window.location.pathname === "/tag"
      || window.location.pathname === "/setting"
      || window.location.pathname === "/saves"
  ) {
    return (
      <div className="header">
        <a className="logo" onClick={handleLogo} target="_blank">
          <img
            className="logo-img"
            src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75"
            alt="waffle_studio"
          />
        </a>
        <div className="main-title" onClick={handleLogo}>
          Waflog
        </div>

        {isLogin ? (
          <>
            <IoSearchOutline className="search-icon" onClick={handleSearch} />
            <button className="btn-write" onClick={handleWrite}>
              새 글 작성
            </button>
          </>
        ) : (
          <>
            <IoSearchOutline
              className="search-icon-unlogin"
              onClick={handleSearch}
            />
            <button
              className="btn-login"
              onClick={handleLogin}
              disabled={isLogin}
            >
              로그인
            </button>
          </>
        )}
        {isLogin ? (
          <div className="user-box">
            <div className="profile-img">
              <img src={userImg} alt="X" className="user-img" onClick={handleOption} />
            </div>
            <IoMdArrowDropdownCircle
              className="option-btn"
              onClick={handleOption}
            />
          </div>
        ) : null}
        {option ? (
          <div className="custom-select">
            <div className="op-1" onClick={handleWaflog}>
              내 와플로그
            </div>
            <div className="op-2" onClick={handleSaves}>
              임시 글
            </div>
            <div className="op-3" onClick={handleSetting}>설정</div>
            <div className="op-4" onClick={handleLogOut}>
              로그아웃
            </div>
          </div>
        ) : null}
        <LoginModal isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
    );
  } else {
    return (
      <div className="header">
        <a className="logo" onClick={handleLogo} target="_blank">
          <img
            className="logo-img"
            src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75"
            alt="waffle_studio"
          />
        </a>
        <div className="page-title" onClick={handlePageTitle}>
          {pageTitle}
        </div>
        {isLogin ? (
          <>
            <IoSearchOutline className="search-icon" onClick={handleSearch} />
            <button className="btn-write" onClick={handleWrite}>
              새 글 작성
            </button>
          </>
        ) : (
          <>
            <IoSearchOutline
              className="search-icon-unlogin"
              onClick={handleSearch}
            />
            <button
              className="btn-login"
              onClick={handleLogin}
              disabled={isLogin}
            >
              로그인
            </button>
          </>
        )}
        {isLogin ? (
          <div className="user-box">
            <div className="profile-img">
              <img src={userImg} alt="X" className="user-img" onClick={handleOption} />
            </div>
            <IoMdArrowDropdownCircle
              className="option-btn"
              onClick={handleOption}
            />
          </div>
        ) : null}
        {option ? (
          <div className="custom-select">
            <div className="op-1" onClick={handleWaflog}>
              내 와플로그
            </div>
            <div className="op-2" onClick={handleSaves}>
              임시 글
            </div>
            <div className="op-3" onClick={handleSetting}>설정</div>
            <div className="op-4" onClick={handleLogOut}>
              로그아웃
            </div>
          </div>
        ) : null}
        <LoginModal isOpen={isOpen} setIsOpen={setIsOpen}></LoginModal>
      </div>
    );
  }
};

export default Header;
