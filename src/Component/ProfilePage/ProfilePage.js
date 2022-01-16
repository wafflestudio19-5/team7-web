import './ProfilePage.scss';
import { ToastContainer, toast } from "react-toastify";
import { useParams, useHistory } from "react-router-dom";
import Header from '../MainPage/Header/Header';
import UserPost from "./UserPost/UserPost";
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const ProfilePage = () => {

    const params = useParams();
    const history = useHistory();
    const URLSearch = new URLSearchParams(window.location.search);
    const postPageRef = useRef({});

    const [word, setWord] = useState("");
    const [userPost, setUserPost] = useState([]);
    const [postPageNumber, setPostPageNumber] = useState(0);

    useEffect(() => {
        axios
            .get(`/api/v1/user/@${params.userId}/search`, {
                params: {
                    page: 0,
                    size: 6
                },
            })
            .then((response) => {
                console.log(response.data);
                setUserPost(response.data.content);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const handleScroll = () => {
        const scrollTop = postPageRef.current.scrollTop;
        const scrollHeight = postPageRef.current.scrollHeight;
        const clientHeight = postPageRef.current.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 10) {
            if (!(postPageNumber === null)) {
                axios
                    .get(`/api/v1/user/@${params.userId}/search`, {
                        params: {
                            page: postPageNumber,
                            size: 6
                        },
                    })
                    .then((response) => {
                        setUserPost(userPost.concat(response.data.content));
                        if (response.data.last === true) {
                            setPostPageNumber(null);
                        } else {
                            setPostPageNumber(postPageNumber + 1);
                        }
                    });
            }
        }
    };

    return(
        <div className="profilepage" ref={postPageRef} onScroll={handleScroll}>
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
                            <div className="user-id">{params.userId}(name)</div>
                            <div className="user-summary">summary</div>
                        </div>
                    </div>
                    <div className="horizon-line"/>
                    <div className="user-link">


                    </div>
                </div>
                <div className="post-type">
                    <div className="select-type">
                        <a className="type-btn">글 목록</a>
                    </div>
                </div>
                <div className="userpost-list">
                    <ul className="search-list">
                        {userPost.map((item) => (
                            <UserPost item={item} userId={params.userId} key={item.id} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;