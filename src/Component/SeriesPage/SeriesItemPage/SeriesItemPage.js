import Header from "../../MainPage/Header/Header";
import './SeriesItemPage.js.scss';
import {useHistory, useLocation, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useSessionContext} from "../../../Context/SessionContext";
import axios from "axios";
import { BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi";
import PostItem from "../../MainPage/PostItem/PostItem";
import dayjs from "dayjs";



const SeriesItemPage = () => {

    const params = useParams();
    const history = useHistory();
    const { search } = useLocation();
    const URLSearch = new URLSearchParams(search);
    const postPageRef = useRef({});
    const initialParams = URLSearch.get("q") === null ? "" : URLSearch.get("q");
    const initialTag = URLSearch.get("tag") === null ? "" : URLSearch.get("tag");
    const { token } = useSessionContext();

    const [order, setOrder] = useState(true);

    const [userSeriesPostList, setUserSeriesPostList] = useState([]);

    useEffect(() => {
        axios
            .get(`/api/v1/user/@${params.userId}/series/${params.name}`, {
                params: {
                },
                headers: {
                    Authentication: token,
                },
            })
            .then((response) => {
                console.log(response.data);
                setUserSeriesPostList(response.data.content);
            });
    },[]);

    const handleSeriesClick = (item) => {
        history.push(``)
    }

    return(
        <div className="series-item-page">
            <Header pageTitle={`${params.userId}.log`} />

            <div className="series-page-wrapper">
                <div className="series-contents-wrapper">
                    <label className="series-label">시리즈</label>
                    <h1 className="series-name">{params.name}</h1>
                    <div className="line"/>
                    <section className="series-contents-list">
                        <div className="series-menubar-wrapper">
                            <div className="series-menubar">
                                <button className="change">수정</button>
                                <button className="delete">삭제</button>
                            </div>
                        </div>
                        <div className="order">
                            {order ?
                                <button className="order-btn">
                                    <BiUpArrowAlt className="up"/>
                                    <span className="order-name">오름차순</span>
                                </button>
                            :
                                <button className="order-btn">
                                    <BiDownArrowAlt className="down"/>
                                    <span className="order-name">내림차순</span>
                                </button>
                            }
                        </div>
                        <div className="series-item-wrapper">
                            {userSeriesPostList.map((item) => (
                                <div className="series-item" key={item.order} onClick={() => handleSeriesClick(item)}>
                                    <h2 className="series-title">
                                        <span className="series-number">
                                        {item.order}.
                                        </span>
                                        <a className="series-title-href">{item.title}</a>
                                    </h2>
                                    <section className="series-main">
                                        <a className="series-main-href">
                                            {item.thumbnail === "" ?
                                                <img className="series-img" src="https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75"/>
                                                :
                                                <img className="series-img" src={item.thumbnail}/>
                                            }
                                        </a>
                                        <div className="series-info">
                                            <p className="series-post-summary">summary</p>
                                            <div className="series-post-date">{dayjs(item.createAt).format("YYYY년 MM월 DD일")}</div>
                                        </div>
                                    </section>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default SeriesItemPage;