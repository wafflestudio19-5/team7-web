import './ProfilePage.scss';
import { ToastContainer, toast } from "react-toastify";
import { useParams, useHistory } from "react-router-dom";
import SearchItem from '../SearchPage/SearchItem/SearchItem';
import Header from '../MainPage/Header/Header';

const ProfilePage = () => {

    const params = useParams();
    const history = useHistory();
    const URLSearch = new URLSearchParams(window.location.search);

    return(
        <div className="profilepage">
            <ToastContainer/>
            <Header pageTitle={`${params.userId}.log`}/>
            <div className="all-container">
                <div className="main-profile">
                    <div className="user-info">
                        <div className="user-img">
                            <img className="userprofile-img"
                                 src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75"
                                 alt="waffle_studio"/>
                        </div>
                        <div className="user-introduce">
                            <div className="user-id">ididididid</div>
                            <div className="user-summary">summarysummarysummarysummarysummarysummarysummary</div>
                        </div>
                    </div>
                    <div className="horizon-line"/>
                    <div className="user-link">
                        linklinklinklinklinklink
                    </div>
                </div>
                <div className="post-type">
                    <div className="select-type">
                        <a className="type-btn">글</a>
                        <a className="type-btn">소개</a>
                    </div>
                </div>
                <div className="userpost-list">

                </div>
            </div>
        </div>
    )
}

export default ProfilePage;