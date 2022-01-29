import { useHistory, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./SavesPage.scss";
import Header from "../MainPage/Header/Header";
import SavePostItem from "./SavePostItem/SavePostItem";
import { BiLoaderAlt } from "react-icons/bi";
import {useSessionContext} from "../../Context/SessionContext";

const SavesPage = () => {
    const history = useHistory();
    const params = useParams();
    const savesPageRef = useRef({});

    const { token, isLogin } = useSessionContext();

    const [totalPostNumber, setTotalPostNumber] = useState(0);
    const [savesPostList, setSavesPostList] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchPageNumber, setSearchPageNumber] = useState(0);
    const [updateSavePost, setUpdateSavePost] = useState();

    const handleReturnHome = () => {
        history.push("");
    };

    useEffect(() => {
        axios
            .get(`/api/v1/save`, {
                params: {
                    page: 0,
                    size: 10,
                },
                headers: {
                    Authentication: token
                }
            })
            .then((response) => {
                console.log(response);
                setTotalPostNumber(response.data.totalElements);
                setSavesPostList(response.data.content);
                setIsSearching(true);
                setIsLoading(false);

                if (response.data.last === true) {
                    setSearchPageNumber(null);
                } else {
                    setSearchPageNumber(1);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [updateSavePost]);

    const handleScroll = () => {
        const scrollTop = savesPageRef.current.scrollTop;
        const scrollHeight = savesPageRef.current.scrollHeight;
        const clientHeight = savesPageRef.current.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 10) {
            if (!(searchPageNumber === null)) {
                axios
                    .get(`/api/v1/save`, {
                        params: {
                            page: searchPageNumber,
                            size: 10,
                        },
                        headers: {
                            Authentication: token
                        }
                    })
                    .then((response) => {
                        setSavesPostList(savesPostList.concat(response.data.content));
                        if (response.data.last === true) {
                            setSearchPageNumber(null);
                        } else {
                            setSearchPageNumber(searchPageNumber + 1);
                        }
                    });
            }
        }
    };

    return (
        <div className="savespage" ref={savesPageRef} onScroll={handleScroll}>

            {isLogin ? (<>
            <Header pageTitle={"Waflog"} />

            <div className="saves-main-section">
                <h1 className="saves-title">임시 글 목록</h1>

                {isLoading ? (
                    <div className="loading-section">
                        <BiLoaderAlt className="loading-icon" />
                        <div className={"loading-text"}>검색 중입니다.</div>
                    </div>
                ) : (
                    <>
                        {isSearching ? (
                            <div className="saves-search-info">
                                총 <b>{totalPostNumber}개</b>의 임시 글을 찾았습니다.
                            </div>
                        ) : (
                            <div className="saves-search-info">저장된 임시 글이 없습니다.</div>
                        )}
                        <ul className="saves-post-list">
                            {savesPostList.map((item) => (
                                <SavePostItem item={item} key={item.id} setUpdateSavePost={setUpdateSavePost} />
                            ))}
                        </ul>
                    </>
                )}
            </div></>):(

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
            </div>)}
        </div>
    );
};

export default SavesPage;
