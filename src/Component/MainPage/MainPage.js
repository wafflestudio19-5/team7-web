import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./MainPage.scss";
import PostItem from "./PostItem/PostItem";
import PostListControlBar from "./PostListControlBar/PostListControlBar";
import Header from "./Header/Header";
import { BiLoaderAlt } from "react-icons/bi";

// 더미 데이터
const dummyData = [
  {
    comments: 0,
    createAt: "2022-01-06T19:51:34.859255",
    id: 11,
    likes: 0,
    summary: "123",
    thumbnail:
      "https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75",
    title: "231",
    url: "321",
    user: {
      id: 8,
      image:
        "https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75",
      userId: "219ydh",
    },
  },

  {
    comments: 0,
    createAt: "2022-01-06T19:51:34.859255",
    id: 11,
    likes: 0,
    summary: "123",
    thumbnail: "",
    title: "231",
    url: "321",
    user: {
      id: 8,
      image:
        "https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=640&q=75",
      userId: "219ydh",
    },
  },
];

const MainPage = () => {
  const [trendPeriod, setTrendPeriod] = useState(
    localStorage.getItem("period") === null
      ? 7
      : parseInt(localStorage.getItem("period"))
  );
  const [trendingPostList, setTrendingPostList] = useState([]);
  const [trendingPostPage, setTrendingPostPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(trendPeriod);
    axios
      .get("/api/v1/post/trend", {
        params: {
          page: 0,
          size: 12,
          date: trendPeriod,
        },
      })
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        setTrendingPostList(response.data.content);

        if (response.data.last === true) {
          setTrendingPostPage(null);
        } else {
          setTrendingPostPage(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [trendPeriod]);

  const trendingPostRef = useRef({});

  const handleScroll = () => {
    const scrollTop = trendingPostRef.current.scrollTop;
    const scrollHeight = trendingPostRef.current.scrollHeight;
    const clientHeight = trendingPostRef.current.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 20) {
      console.log("BOTTOM!!!!!");
      if (!(trendingPostPage === null)) {
        axios
          .get("/api/v1/post/trend", {
            params: {
              page: trendingPostPage,
              size: 12,
              date: trendPeriod,
            },
          })
          .then((response) => {
            setTrendingPostList(trendingPostList.concat(response.data.content));
            if (response.data.last === true) {
              setTrendingPostPage(null);
            } else {
              setTrendingPostPage(trendingPostPage + 1);
            }
            console.log(response);
          });
      }
    }
  };

  return (
    <div className="mainpage" ref={trendingPostRef} onScroll={handleScroll}>
      <Header />
      <PostListControlBar
        trendPeriod={trendPeriod}
        setTrendPeriod={setTrendPeriod}
        setTrendingPostPage={setTrendingPostPage}
      />

      {isLoading ? (
        <div className="loading-section">
          <BiLoaderAlt className="loading-icon" />
          <div className={"loading-text"}>로딩 중입니다.</div>
        </div>
      ) : (
        <ul className={"PostList"}>
          {trendingPostList.map((item) => (
            <PostItem item={item} key={item.id} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainPage;
