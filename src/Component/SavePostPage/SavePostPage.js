import React, { useState, createRef, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
// import './WritePage.scss';
import WriteModal from "../WritePage/WriteModal/WriteModal";
import ErrorPageWrite from "../WritePage/ErrorPage-Write/ErrorPage-Write";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

import Prism from "prismjs";
import "prismjs/themes/prism.css";

// code-syntax-highlight
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

// color-syntax
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

import { BiArrowBack } from "react-icons/bi";
import { AiOutlineEnter } from "react-icons/ai";
import { toast } from "react-toastify";
import { useSessionContext } from "../../Context/SessionContext";
import SavePostModal from "./SavePostModal/SavePostModal";

const dataFormat = {
  comments: [],
  content: "",
  createdAt: "",
  id: 0,
  likes: 0,
  nextPost: {},
  prevPost: {},
  seriesPosts: null,
  tags: [],
  thumbnail: "",
  title: "",
  url: "",
  user: {
    facebookId: "",
    githubId: "",
    homepage: "",
    id: 0,
    image: "",
    name: "",
    pageTitle: "",
    publicEmail: "",
    shortIntro: "",
    twitterId: "",
    userId: "",
  },
};

const SavePostPage = () => {
  const { handleLogout, isLogin, userId, token } = useSessionContext();

  const titleRef = createRef();
  const editorRef = createRef();
  const history = useHistory();
  const params = useParams();

  const [postResponse, setPostResponse] = useState(dataFormat);

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [tagList, setTagList] = useState([]);
  const [tagId, setTagId] = useState(0);
  const [imgTag, setImgTag] = useState([]);
  const [urlId, setUrlId] = useState("");

  const onChangeEditorTextHandler = () => {
    setContents(editorRef.current.getInstance().getMarkdown());
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleTagInput = (e) => {
    if (e.target.value.substr(e.target.value.length - 1, 1) === ",") {

      if (tagList.some((tag) => tag === e.target.value.substr(0, e.target.value.length - 1))) {
        setTag("");
      } else {
        setTagList(tagList.concat([e.target.value.substr(0, e.target.value.length - 1)]));
        setTag("");
        setTagId(Number(tagId) + 1);
        console.log(tagList);
      }
    } else {
      setTag(e.target.value);
    }
  };

  const handleDeleteTag = (item) => {
    setTagList(tagList.filter((tag) => tag !== item));
  };

  const handleOut = () => {
    history.replace("/saves");
  };

  const handleSave = () => {
    const tags = [];

    for (const i in tagList) {
      tags.push(tagList[i]);
    }


    console.log(tags);

    axios
        .put(
            `/api/v1/save`,
            {
              token: params.saveToken,
              title: title,
              content: contents,
              tags: tags,
              images: imgTag,
            },
            {
              headers: {
                Authentication: token,
              },
            }
        )
        .then((response) => {
          toast.success("임시저장되었습니다.", { autoClose: 3000 });
        })
        .catch((error) => {
          toast.error("임시저장에 실패했습니다.", {
            autoClose: 3000,
          });
          toast.error(error.response.data.detail, {
            autoClose: 3000,
          });
          console.log(error.response);
        });
  };

  const handleSubmit = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    console.log("SavePost Page");

    console.log(editorRef.current);


    axios
      .get(`api/v1/save?id=${params.saveToken}`, {
        headers: {
          Authentication: token,
        },
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("tempContent", response.data.content);
        editorRef.current.props.initialValue = response.data.content;
        setPostResponse(response.data);
        setTitle(response.data.title);
        setContents(response.data.content);
        setTagList(response.data.tags);
        setTagId(response.data.tags.length);
      })
      .catch((error) => {
        console.log(error);
        history.push("/error"); // 백엔드 404 response 필요!!
      });

    // axios
    //   .post(
    //     `api/v1/post/token?url=${params.postUrl}`,
    //     {},
    //     {
    //       headers: {
    //         Authentication: token,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setUrlId(response.data.id);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     history.push("/error"); // 백엔드 404 response 필요!!
    //   });
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      editorRef.current
        .getInstance()
        .addHook("addImageBlobHook", (blob, callback) => {
          (async () => {
            const formData = new FormData();
            formData.append("image", blob);

            const res = await axios
              .post(`/api/v1/image`, formData, {
                headers: {
                  Authentication: token,
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                console.log("이미지 토큰 데이터 테스트");
                console.log(res.data.token);
                const imgTagForm = { token: res.data.token };
                setImgTag(imgTag.concat(imgTagForm));

                callback(res.data.url, "alt text");
              })
              .catch((error) => {
                toast.error("이미지 업로드에 실패했습니다.", {
                  autoClose: 3000,
                });
              });
          })();
          return false;
        });
    }
    return () => {};
  }, [editorRef]);

  return (
    <div>
      {isLogin ? (
        <div>
          <textarea
            placeholder="제목을 입력하세요."
            className="title-style"
            ref={titleRef}
            value={title}
            onChange={handleTitle}
          />
          <div className="tag-box">
            {tagList.map((item) => (
              <div
                className="tag-style"
                onClick={() => handleDeleteTag(item)}
              >
                {item}
              </div>
            ))}
            <input
              placeholder="태그를 입력하세요."
              tabIndex="2"
              className="tag-input"
              value={tag}
              onChange={handleTagInput}
            />
          </div>
          <div className="tag-guide">
            쉼표를 사용해 태그를 구분 할 수 있습니다. 태그를 클릭 시 삭제
            가능합니다.
          </div>
          <Editor
            previewStyle="vertical"
            height="75vh"
            initialEditType="markdown"
            ref={editorRef}
            plugins={[
              colorSyntax,
              [codeSyntaxHighlight, { highlighter: Prism }],
            ]}
            initialValue={localStorage.getItem("tempContent")}
            onChange={onChangeEditorTextHandler}
          />
          <div className="btn-box">
            <button className="out-btn" onClick={handleOut}>
              <BiArrowBack className="out-icon" />
              <span>나가기</span>
            </button>
            <button className="submit-btn" onClick={handleSave}>
              임시저장
              <AiOutlineEnter className="submit-icon" />
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              업로드
              <AiOutlineEnter className="submit-icon" />
            </button>
          </div>
          <SavePostModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={title}
            contents={contents}
            tagList={tagList}
            imgTag={imgTag}
          />
        </div>
      ) : (
        <ErrorPageWrite />
      )}
    </div>
  );
};

export default SavePostPage;
