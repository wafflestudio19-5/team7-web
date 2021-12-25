import "./PostListControlBar.scss";
import {useHistory} from "react-router-dom";
import { IoMdTrendingUp } from "react-icons/io";
import { FiClock } from "react-icons/fi";

const PostListControlBar = () => {

    const history = useHistory();

    const handleTrending = () => {
        history.push("");
    }
    const handleRecent = () => {
        history.replace("/recent");
    }
    



  return (
    <div className={"PostListControlBar"}>
      <div className={"CategorySection"}>
        <a className={window.location.pathname==="/"?"TrendingButton" : "TrendingButton-unselected"} onClick={handleTrending}>
          <IoMdTrendingUp className={"TrendingIcon"} /> 트렌딩
        </a>
        <a className={window.location.pathname==="/recent"?"RecentButton" : "RecentButton-unselected"} onClick={handleRecent}>
          <FiClock className={"ClockIcon"} /> 최신
        </a>
      </div>

      <select
          className={window.location.pathname==="/"?"PeriodSelectBox" : "PeriodSelectBox-hidden"}
          name="Period"
      >
          <option value="today">오늘</option>
        <option value="week" selected>이번 주</option>
        <option value="month">이번 달</option>
        <option value="year">올해</option>
      </select>


    </div>
  );
};

export default PostListControlBar;
