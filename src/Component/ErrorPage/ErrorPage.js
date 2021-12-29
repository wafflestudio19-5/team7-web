import { useHistory } from "react-router-dom";
import "./ErrorPage.scss";

const ErrorPage = () => {
  const history = useHistory();

  const handleReturnHome = () => {
    history.push("");
  };

  return (
    <div className="errorpage">
      <img
        className="error-image"
        src="https://static.velog.io/static/media/undraw_page_not_found_su7k.7e3de5e9.svg"
        alt="error"
      />
      <div className={"text-nothing"}>아무것도 없네요!</div>
      <button className={"btn-returnhome"} onClick={handleReturnHome}>
        홈으로
      </button>
    </div>
  );
};

export default ErrorPage;
