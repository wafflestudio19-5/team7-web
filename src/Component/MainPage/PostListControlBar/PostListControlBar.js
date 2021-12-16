import "./PostListControlBar.scss";
import { IoMdTrendingUp } from "react-icons/io";
import { FiClock } from "react-icons/fi";

const PostListControlBar = () => {
  return (
    <div className={"PostListControlBar"}>
      <div className={"CategorySection"}>
        <a className={"TrendingButton"}>
          <IoMdTrendingUp className={"TrendingIcon"} /> 트렌딩
        </a>
        <a className={"RecentButton"}>
          <FiClock className={"ClockIcon"} /> 최신
        </a>
      </div>

      <select
          className={"PeriodSelectBox"}
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
