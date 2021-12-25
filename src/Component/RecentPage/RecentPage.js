import {useEffect, useState} from "react";
import './RecentPage.scss';
import axios from "axios";
import {useHistory} from "react-router-dom";
import Header from "../MainPage/Header/Header";
import PostListControlBar from "../MainPage/PostListControlBar/PostListControlBar";
import PostItem from "../MainPage/PostItem/PostItem";


// 더미 데이터
const dummyData2 = [
    {
        id: 1,
        title: "최신 페이지 테스트",
        summary: "2021년 다녀본 국내 여행지들 모음",
        postImg:
            "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
        date:"2021년 12월 7일",
        comments:7,
        authorImg:"https://github.githubassets.com/images/modules/logos_page/Octocat.png",
        author:"김와플",
        likes:100
    },
    {
        id: 2,
        title: "클라우드프론트 배포방법",
        summary: "클라우드프론트 배포방법에 대해",
        postImg:
            "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
        date:"2021년 12월 7일",
        comments:7,
        authorImg:"https://github.githubassets.com/images/modules/logos_page/Octocat.png",
        author:"이와플",
        likes:65
    }
];


const RecentPage = () => {

    useEffect(() => {
        axios
            .get(
                "http://waflog.kro.kr/api/v1/post/recent/",
                {
                    params: {
                        page: 0
                    }
                }
            )
            .then((response) => {
                console.log(response);

            })
            .catch((error) => {
                console.log(error);

            });
    }, []);


    return (
        <div className="recentpage">

            <Header/>
            <PostListControlBar/>

            <ul className={"PostList"}>
                {dummyData2.map((item) => (
                    <PostItem item={item} key={item.id} />
                ))}
            </ul>


        </div>
    )
}

export default RecentPage;