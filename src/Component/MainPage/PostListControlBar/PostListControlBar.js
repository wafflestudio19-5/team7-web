import "./PostListControlBar.scss";
import { useHistory } from "react-router-dom";
import { IoMdTrendingUp } from "react-icons/io";
import { FiClock } from "react-icons/fi";

const PostListControlBar = ({ trendPeriod, setTrendPeriod, setTrendingPostPage }) => {
  const history = useHistory();

  const handleTrending = () => {
    history.push("");
  };
  const handleRecent = () => {
    history.replace("/recent");
  };

  const handlePeriod = () => {
    const langSelect = document.getElementById("PeriodSelectBox");
    // select element에서 선택된 option의 value가 저장된다.
    const selectValue = langSelect.options[langSelect.selectedIndex].value;
    // select element에서 선택된 option의 text가 저장된다.
    const selectText = langSelect.options[langSelect.selectedIndex].text;
    localStorage.setItem('period', selectValue);
    setTrendPeriod(selectValue);
    setTrendingPostPage(0);
    console.log(selectValue);
  };

  return (
    <div className={"PostListControlBar"}>
      <div className={"CategorySection"}>
        <a
          className={
            window.location.pathname === "/"
              ? "TrendingButton"
              : "TrendingButton-unselected"
          }
          onClick={handleTrending}
        >
          <IoMdTrendingUp className={"TrendingIcon"} /> 트렌딩
        </a>
        <a
          className={
            window.location.pathname === "/recent"
              ? "RecentButton"
              : "RecentButton-unselected"
          }
          onClick={handleRecent}
        >
          <FiClock className={"ClockIcon"} /> 최신
        </a>
      </div>

      <select
        id={"PeriodSelectBox"}
        className={
          window.location.pathname === "/"
            ? "PeriodSelectBox"
            : "PeriodSelectBox-hidden"
        }
        name="Period"
        defaultValue={`${trendPeriod}`}
        onChange={handlePeriod}
      >
        <option value="0">오늘</option>
        <option value="7">이번 주</option>
        <option value="30">이번 달</option>
        <option value="365">올해</option>
      </select>
    </div>
  );
};

export default PostListControlBar;
