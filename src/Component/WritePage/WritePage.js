import React, {useState, createRef, useEffect} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import './WritePage.scss';
import WriteModal from './WriteModal/WriteModal';

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

const WritePage = () => {

    const titleRef = createRef();
    const editorRef = createRef();
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const onChangeEditorTextHandler = () => {
        setContents(editorRef.current.getInstance().getMarkdown());
    }

    const handleTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleOut = () => {
        history.replace("");
    }
    const handleSubmit = () => {
        setIsOpen(true);
    }

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getInstance().removeHook("addImageBlobHook");
            editorRef.current
                .getInstance()
                .addHook("addImageBlobHook", (blob, callback) => {
                    console.log("이미지 감지");
                    /*(async () => {
                        let formData = new FormData();
                        formData.append("file", blob);

                        axios.defaults.withCredentials = true;
                        const { data: url } = await axios.post(
                            `${backUrl}image.do`,
                            formData,
                            {
                                header: { "content-type": "multipart/formdata" },
                            }
                        );
                        callback(url, "alt text");
                    })();*/

                    return false;
                });
        }

        return () => {};
    }, [editorRef]);

    return (
        <div>
            <textarea
                placeholder="제목을 입력하세요."
                className="title-style"
                ref={titleRef}
                value={title}
                onChange={handleTitle}
            />
            <Editor
                previewStyle="vertical"
                height="80vh"
                initialEditType="markdown"
                placeholder="내용을 입력하세요."
                ref={editorRef}
                plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
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
            <WriteModal isOpen={isOpen} setIsOpen={setIsOpen} title={title} contents={contents}/>
        </div>
    )
}

export default WritePage;
