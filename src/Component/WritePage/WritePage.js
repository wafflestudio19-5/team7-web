import React, { useState, createRef, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./WritePage.scss";
import WriteModal from "./WriteModal/WriteModal";
import ErrorPageWrite from "./ErrorPage-Write/ErrorPage-Write";

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
import PostItem from "../MainPage/PostItem/PostItem";

const WritePage = () => {
  const { handleLogout, isLogin, userId, token } = useSessionContext();

  const titleRef = createRef();
  const editorRef = createRef();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [tagList, setTagList] = useState([]);
  const [tagId, setTagId] = useState(0);
  const [imgTag, setImgTag] = useState([]);

  const onChangeEditorTextHandler = () => {
    setContents(editorRef.current.getInstance().getMarkdown());
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleTagInput = (e) => {
    const urlPattern = /^[a-zA-Zㄱ-힣0-9-_,][a-zA-Zㄱ-힣0-9-_, ]*$/;

    if (e.target.value === "") {
    } else if (!e.target.value.match(urlPattern)) {
      toast.error("사용 불가능한 태그입니다.", {
        autoClose: 3000,
      });
      return;
    }

    if (e.target.value.substr(e.target.value.length - 1, 1) === ",") {
      const tagForm = {
        id: tagId,
        tag: e.target.value.substr(0, e.target.value.length - 1),
      };

      if (tagList.some((tag) => tag.tag === tagForm.tag)) {
        setTag("");
      } else {
        setTagList(tagList.concat(tagForm));
        setTag("");
        setTagId(Number(tagId) + 1);
      }
    } else {
      setTag(e.target.value);
    }
  };

  const handleDeleteTag = (item) => {
    setTagList(tagList.filter((tag) => tag.id !== item.id));
  };

  const handleOut = () => {
    history.replace("");
  };

  const handleSave = () => {
    const tags = [];

    for (const i in tagList) {
      tags.push(tagList[i].tag);
    }

    console.log(tags);

    axios
      .post(
        `/api/v1/save`,
        {
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
        history.push("");
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
                key={item.id}
                onClick={() => handleDeleteTag(item)}
              >
                {item.tag}
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
            placeholder="내용을 입력하세요."
            ref={editorRef}
            plugins={[
              colorSyntax,
              [codeSyntaxHighlight, { highlighter: Prism }],
            ]}
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
          <WriteModal
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

export default WritePage;
