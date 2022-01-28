import {useState, useRef, useEffect} from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Modal from "react-modal";
import "./WriteModal.scss";
import { BsImage, BsFileEarmarkLock } from "react-icons/bs";
import { BiListPlus } from "react-icons/bi";
import { GoGlobe } from "react-icons/go";
import { AiFillSetting } from "react-icons/ai"
import axios from "axios";
import { useSessionContext } from "../../../Context/SessionContext";
import { toast } from "react-toastify";

const WriteModal = (props) => {
  const { handleLogout, isLogin, userId, token } = useSessionContext();
  const { isOpen, setIsOpen, title, contents, tagList, imgTag } = props;
  const history = useHistory();

  const [summaryIn, setSummaryIn] = useState("");
  const [summaryOver, setSummaryOver] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [url, setUrl] = useState(title);

  const [thumbImgBase64, setThumbImgBase64] = useState(""); // 파일 base64
  const [thumbImgFile, setThumbImgFile] = useState(null); //파일
  const [thumbUrl, setThumbUrl] = useState("");

  const [openSeries, setOpenSeries] = useState(false);
  const [userSeriesList, setUserSeriesList] = useState([]);
  const [inSeries, setInSeries] = useState("");

  const [selectSeries, setSelectSeries] = useState("");

  useEffect(() => {
    setUrl(title);
    console.log(url);
  },[])

  const handleThumbnailFile = (event) => {
    const reader = new FileReader();
    const formData = new FormData();

    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      setThumbImgFile(event.target.files[0]); // 파일 상태 업데이트
      console.log(event.target.files[0]);
      formData.append('image',event.target.files[0]);
    }

    axios.post(`/api/v1/image`,
      formData
    ,{
      headers: {
        Authentication: token,
        'Content-Type': 'multipart/form-data'
      },
    })
        .then((res) => {
          setThumbUrl(res.data.url);
          toast.success("썸네일 업로드에 성공했습니다.", {
            autoClose: 3000,
          });
          reader.onloadend = () => {
            // 2. 읽기가 완료되면 아래코드가 실행됩니다.
            const base64 = reader.result;
            if (base64) {
              setThumbImgBase64(base64.toString()); // 파일 base64 상태 업데이트
            }
          };
          console.log(res.data);
        })
        .catch((error) => {
          toast.error("썸네일 업로드에 실패했습니다.", {
            autoClose: 3000,
          });
          setThumbImgBase64("");
          setThumbImgFile(null);
          setThumbUrl("");
          console.log(error);
        });
  };

  const logoImgInput = useRef({});

  const handleSummaryIn = (e) => {
    if (e.target.value.length <= 150) {
      setSummaryIn(e.target.value);
      setSummaryOver(false);
    } else {
      const cut = e.target.value.substr(0, 150);
      setSummaryIn(cut);
      setSummaryOver(true);
    }
  };

  const handlePublic = () => {
    setIsPublic(true);
  };
  const handlePrivate = () => {
    setIsPublic(false);
  };
  const handleUrl = (e) => {
    setUrl(e.target.value);
  };
  const handleCancle = () => {
    setIsOpen(false);
  };
  const handleSeriesCancle = () => {
    setOpenSeries(false);
    setSelectSeries("");
  }
  const handleSubmit = () => {
    const urlPattern = /^[a-zA-Zㄱ-힣0-9-_,][a-zA-Zㄱ-힣0-9-_, ]*$/;

    const tags = [];

    for(const i in tagList ){
      tags.push(tagList[i].tag);
    }

    console.log(tags);

    if(!url.match(urlPattern) || url.length >= 100){
      toast.error("올바르지 않은 url입니다.", {
        autoClose: 3000,
      });
      setUrl("");
      return;
    }

    if (title === "" || title.length === 0) {
      toast.error("제목이 비었습니다.", {
        autoClose: 3000,
      });
    }
    else{
      console.log(selectSeries);
      if(selectSeries === ""){
        axios
            .post(
                `/api/v1/post`,
                {
                  title: title,
                  content: contents,
                  thumbnail: thumbUrl,
                  summary: summaryIn,
                  private: !isPublic,
                  url: url,
                  tags: tags,
                  images: imgTag
                },
                {
                  headers: {
                    Authentication: token,
                  },
                }
            )
            .then((response) => {
              history.push("");
            })
            .catch((error) => {
              toast.error("업로드에 실패했습니다.", {
                autoClose: 3000,
              });
              toast.error(error.response.data.detail, {
                autoClose: 3000,
              });
              console.log(error.response);
            });
      }
      else{
        axios
            .post(
                `/api/v1/post`,
                {
                  title: title,
                  content: contents,
                  thumbnail: thumbUrl,
                  summary: summaryIn,
                  private: !isPublic,
                  url: url,
                  tags: tags,
                  images: imgTag,
                  seriesName: selectSeries,
                },
                {
                  headers: {
                    Authentication: token,
                  },
                }
            )
            .then((response) => {
              history.push("");
            })
            .catch((error) => {
              toast.error("업로드에 실패했습니다.", {
                autoClose: 3000,
              });
              toast.error(error.response.data.detail, {
                autoClose: 3000,
              });
              console.log(error.response);
            });
      }
    }

  };
  const handleThumbnail = (e) => {
    e.preventDefault();
    logoImgInput.current.click();
  };

  const handleOpenSeries = () => {
    setOpenSeries(true);
    axios
        .get(`/api/v1/user/@${userId}/series`, {
          params: {
          },
        })
        .then((response) => {
          console.log(response.data);
          setUserSeriesList(response.data.content);
        });
  };
  const handleInSeries = (e) => {
    setInSeries(e.target.value);
  };
  const handleAddSeries = () => {
    const urlPattern = /^[a-zA-Zㄱ-힣0-9-_,][a-zA-Zㄱ-힣0-9-_, ]*$/;

    if(!inSeries.match(urlPattern) || inSeries.length >= 100 || inSeries === ""){
      toast.error("올바르지 않은 시리즈 이름입니다.", {
        autoClose: 3000,
      });
      setInSeries("");
      return;
    }

    axios
        .post(
            `/api/v1/user/series`,
            {
              name: inSeries
            },
            {
              headers: {
                Authentication: token,
              },
            }
        )
        .then((response) => {
          axios
              .get(`/api/v1/user/@${userId}/series`, {
                params: {
                },
              })
              .then((response) => {
                console.log(response.data);
                setUserSeriesList(response.data.content);
              });
          setSelectSeries(inSeries);
          setInSeries("");
          toast.success("시리즈 추가에 성공했습니다.", {
            autoClose: 2000,
          });
        })
        .catch((error) => {
          setInSeries("");
          setSelectSeries("");
          toast.error(error.response.data.detail, {
            autoClose: 3000,
          });
          console.log(error.response);
        });
  }
  const handleSelectSeries = (item) => {
    setSelectSeries(item);
  }
  const handleConfirmSeries = () => {
    setOpenSeries(false);
  }
  const handleDeleteSelect = () => {
    setSelectSeries("");
  }

  Modal.setAppElement("#root");

  return (
    <Modal
      className="login-modal"
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
    >
      <div className="left-box">
        <h2 className="preview-title">포스트 미리보기</h2>
        <div className="thumbnail-box">
          {thumbImgFile === null ? (
            <BsImage className="thumbnail-icon" />
          ) : (
            <img
              src={thumbImgBase64}
              alt={"썸네일"}
              className="thumbnail-img"
            />
          )}
          <button className="upload-btn" onClick={handleThumbnail}>
            업로드
          </button>
          <input
            className="upload-input"
            type="file"
            accept="image/*"
            ref={logoImgInput}
            onChange={handleThumbnailFile}
            name="thumbImgFile"
            id="thumbImgFile"
          />
        </div>
        <textarea
          className="summary-box"
          placeholder="당신의 포스트를 짧게 소개해보세요."
          value={summaryIn}
          onChange={handleSummaryIn}
        />
        <div className={`text-num ${summaryOver ? "over" : ""}`}>
          {summaryIn.length}/150
        </div>
      </div>
      <div className="line-center"></div>
      {openSeries ?
          <div className="right-box">
            <h2 className="open-title">시리즈 설정</h2>

            <div className="series-contents">
              <div className="series-input-wrapper-out">
                <div className="series-btn-wrapper-in">
                  <input className="series-input" placeholder="새로운 시리즈 이름을 입력하세요" value={inSeries} onChange={handleInSeries}/>
                  <button className="series-btn-add" onClick={handleAddSeries}>추가</button>
                </div>
              </div>
              <ul className="series-list-wrapper">
                {userSeriesList.map((item) => (
                    <li className={`series-list ${item.name===selectSeries ? 'on': ''}`} onClick={() => handleSelectSeries(item.name)} key={item.id}>{item.name}</li>
                ))}
              </ul>

            </div>

            <div className="btn-box">
              <button className="btn-cancle" onClick={handleSeriesCancle}>
                취소
              </button>
              <button className={`btn-submit ${selectSeries === "" ? 'none' : ''}`} onClick={handleConfirmSeries} disabled={selectSeries === ""}>
                선택하기
              </button>
            </div>
          </div>
          :
          <div className="right-box">
            <h2 className="open-title">공개설정</h2>
            <div className="set-box">
              <button
                  className={`public-btn ${isPublic ? "" : "not"}`}
                  onClick={handlePublic}
              >
                <GoGlobe className="public-icon" />
                전체 공개
              </button>
              <button
                  className={`private-btn ${isPublic ? "not" : ""}`}
                  onClick={handlePrivate}
              >
                <BsFileEarmarkLock className="private-icon" />
                비공개
              </button>
            </div>
            <h2 className="url-title">URL 설정</h2>
            <h5 className="url-check">한글 영어 공백만 사용한 100자 이내의 문자열만 가능합니다.</h5>
            <div className="url-box">
              <div className="username-box">/@{userId}/</div>
              <input className="url-input" value={url} onChange={handleUrl} />
            </div>
            <h2 className="series-title">시리즈 설정</h2>
            {selectSeries === "" ?
                <div className="series-box">
                  <button className="series-btn" onClick={handleOpenSeries}>
                    <BiListPlus className="series-img"/>
                    시리즈에 추가하기
                  </button>
                </div>
                :
                <div className="series-box-set">
                  <div className="name-wrapper">
                    <div className="name">{selectSeries}</div>
                  </div>
                  <button className="series-btn-set" onClick={handleOpenSeries}>
                    <AiFillSetting className="series-img-set"/>
                  </button>
                </div>
            }
            {selectSeries === "" ?
                null
                :
                <div className="series-delete">
                  <button className="series-delete-btn" onClick={handleDeleteSelect}>시리즈에서 제거</button>
                </div>
            }
            <div className="btn-box">
              <button className="btn-cancle" onClick={handleCancle}>
                취소
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                출간하기
              </button>
            </div>
          </div>
      }

    </Modal>
  );
};

export default WriteModal;
