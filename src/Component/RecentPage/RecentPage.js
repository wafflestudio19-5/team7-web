import { useEffect, useState, useRef } from "react";
import "./RecentPage.scss";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Header from "../MainPage/Header/Header";
import PostListControlBar from "../MainPage/PostListControlBar/PostListControlBar";
import PostItem from "../MainPage/PostItem/PostItem";
import { useSessionContext } from "../../Context/SessionContext";
import { BiLoaderAlt } from "react-icons/bi";

// 더미 데이터
const dummyData2 = [
  {
    id: 1,
    title: "최신 페이지 테스트",
    summary: "2021년 다녀본 국내 여행지들 모음",
    postImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    date: "2021년 12월 7일",
    comments: 7,
    authorImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    author: "김와플",
    likes: 100,
  },
  {
    id: 2,
    title: "클라우드프론트 배포방법",
    summary: "클라우드프론트 배포방법에 대해",
    postImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    date: "2021년 12월 7일",
    comments: 7,
    authorImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    author: "이와플",
    likes: 65,
  },
  {
    id: 3,
    title: "클라우드프론트 배포방법",
    summary: "클라우드프론트 배포방법에 대해",
    postImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    date: "2021년 12월 7일",
    comments: 7,
    authorImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    author: "이와플",
    likes: 65,
  },
  {
    id: 4,
    title: "클라우드프론트 배포방법",
    summary: "클라우드프론트 배포방법에 대해",
    postImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    date: "2021년 12월 7일",
    comments: 7,
    authorImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    author: "이와플",
    likes: 65,
  },
  {
    id: 5,
    title: "클라우드프론트 배포방법",
    summary: "클라우드프론트 배포방법에 대해",
    postImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    date: "2021년 12월 7일",
    comments: 7,
    authorImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    author: "이와플",
    likes: 65,
  },
  {
    id: 6,
    title: "클라우드프론트 배포방법",
    summary: "클라우드프론트 배포방법에 대해",
    postImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    date: "2021년 12월 7일",
    comments: 7,
    authorImg:
      "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
    author: "이와플",
    likes: 65,
  },
];

const RecentPage = () => {
  const { isLogin, token } = useSessionContext();

  const [recentPostList, setRecentPostList] = useState([]);
  const [recentPostPage, setRecentPostPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/v1/post/recent", {
        params: {
          page: 0,
          size: 12,
        },
        headers: {
          Authentication: token,
        },
      })
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        setRecentPostList(response.data.content);
        if (response.data.last === true) {
          setRecentPostPage(null);
        } else {
          setRecentPostPage(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const recentPostRef = useRef({});

  const handleScroll = () => {
    const scrollTop = recentPostRef.current.scrollTop;
    const scrollHeight = recentPostRef.current.scrollHeight;
    const clientHeight = recentPostRef.current.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 20) {
      console.log("BOTTOM!!!!!");
      if (!(recentPostPage === null)) {
        axios
          .get("/api/v1/post/recent", {
            params: {
              page: recentPostPage,
              size: 12,
            },
            headers: {
              Authentication: token,
            },
          })
          .then((response) => {
            setRecentPostList(recentPostList.concat(response.data.content));
            if (response.data.last === true) {
              setRecentPostPage(null);
            } else {
              setRecentPostPage(recentPostPage + 1);
            }
            console.log(recentPostList);
            console.log(recentPostPage);
          });
      }
    }
  };

  return (
    <div className="recentpage" ref={recentPostRef} onScroll={handleScroll}>
      <Header />
      <PostListControlBar />

      {isLoading ? (
        <div className="loading-section">
          <BiLoaderAlt className="loading-icon" />
          <div className={"loading-text"}>로딩 중입니다.</div>
        </div>
      ) : (
        <ul className={"PostList"}>
          {recentPostList.map((item) => (
            <PostItem item={item} key={item.id} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentPage;
