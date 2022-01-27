import React, {useState, createRef, useEffect} from "react";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";
// import './WritePage.scss';
import UpdateModal from "./UpdateModal/UpdateModal";
import ErrorPageWrite from "../WritePage/ErrorPage-Write/ErrorPage-Write";


import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

// code-syntax-highlight
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// color-syntax
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import { BiArrowBack } from "react-icons/bi";
import { AiOutlineEnter } from "react-icons/ai"
import {toast} from "react-toastify";
import {useSessionContext} from "../../Context/SessionContext";
import PostItem from "../MainPage/PostItem/PostItem";


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

const UpdatePage = () => {

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
    }

    const handleTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleTagInput = (e) => {
        if(e.target.value.substr(e.target.value.length - 1, 1) === ','){
            const tagForm = {
                id : tagId,
                name : e.target.value.substr(0, e.target.value.length - 1)
            };

            if(tagList.some(tag => tag.name === tagForm.name)){
                setTag("");
            }
            else{
                setTagList(tagList.concat(tagForm));
                setTag("");
                setTagId(Number(tagId) + 1);
            }
        }
        else{
            setTag(e.target.value);
        }
    }

    const handleDeleteTag = (item) => {
        setTagList(tagList.filter((tag) => tag.id !== item.id));
    }

    const handleOut = () => {
        history.replace("");
    }
    const handleSubmit = () => {
        setIsOpen(true);
    }

    useEffect(() => {
        console.log("Update Page");

        axios
            .get(`api/v1/post/@${params.userId}/${params.postUrl}`, {
                headers: {
                    Authentication: token,
                }
            })
            .then((response) => {
                console.log(response);
                localStorage.setItem("tempContent", response.data.content);
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

        axios
            .post(`api/v1/post/token?url=${params.postUrl}`, {},{
                headers: {
                    Authentication: token,
                }
            })
            .then((response) => {
                setUrlId(response.data.id);
            })
            .catch((error) => {
                console.log(error);
                history.push("/error"); // 백엔드 404 response 필요!!
            });
    },[]);


    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getInstance().removeHook("addImageBlobHook");
            editorRef.current
                .getInstance()
                .addHook("addImageBlobHook", (blob, callback) => {
                    (async () => {
                        const formData = new FormData();
                        formData.append('image', blob);

                        const res = await axios.post(`/api/v1/image`,
                            formData,
                            {
                                headers: {
                                    Authentication: token,
                                    'Content-Type': 'multipart/form-data'
                                },
                            }
                        )
                            .then((res) => {
                                console.log("이미지 토큰 데이터 테스트");
                                console.log(res.data.token);
                                const imgTagForm = { "token" : res.data.token };
                                setImgTag(imgTag.concat(imgTagForm));

                                callback(res.data.url, "alt text");
                            })
                            .catch((error) => {
                                toast.error("이미지 업로드에 실패했습니다.", {
                                    autoClose: 3000,
                                });
                            })
                    })();
                    return false;
                });
        }
        return () => {};
    }, [editorRef]);

    return (
        <div>
            {isLogin ?
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
                            <div className="tag-style" key={item.id} onClick={() => handleDeleteTag(item)}>{item.name}</div>
                        ))}
                        <input placeholder="태그를 입력하세요." tabIndex="2" className="tag-input" value={tag} onChange={handleTagInput}/>
                    </div>
                    <div className="tag-guide">쉼표를 사용해 태그를 구분 할 수 있습니다. 태그를 클릭 시 삭제 가능합니다.</div>
                    <Editor
                        previewStyle="vertical"
                        height="75vh"
                        initialEditType="markdown"
                        ref={editorRef}
                        plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
                        initialValue={localStorage.getItem("tempContent")}
                        onChange={onChangeEditorTextHandler}
                    />
                    <div className="btn-box">
                        <button className="out-btn" onClick={handleOut}>
                            <BiArrowBack className="out-icon"/>
                            <span>나가기</span>
                        </button>
                        <button className="submit-btn" onClick={handleSubmit}>
                            업로드
                            <AiOutlineEnter className="submit-icon"/>
                        </button>
                    </div>
                    <UpdateModal isOpen={isOpen} setIsOpen={setIsOpen} title={title} contents={contents} tagList={tagList} imgTag={imgTag} urlId={urlId}/>
                </div>
                :
                <ErrorPageWrite/>
            }

        </div>
    )
}

export default UpdatePage;
