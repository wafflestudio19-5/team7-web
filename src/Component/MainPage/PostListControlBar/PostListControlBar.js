import "./PostListControlBar.scss";
import {IoMdTrendingUp} from "react-icons/io";


const PostListControlBar = () => {

    return (
        <div className={"PostListControlBar"}>
          <div className={"CategorySection"}>
            <a className={"TrendingButton"}>
                <IoMdTrendingUp className={"TrendingIcon"}/> 트렌딩
            </a>
              <a className={"RecentButton"}>

              </a>

          </div>




        </div>
    );
};

export default PostListControlBar;
