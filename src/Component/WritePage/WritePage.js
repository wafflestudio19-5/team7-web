import React, {useState, createRef} from "react";
import './WritePage.scss';
import {useHistory} from "react-router-dom";

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

const WritePage = () => {

    const editorRef = createRef();

    const onChangeEditorTextHandler = () => {
        console.log(editorRef.current.getInstance().getMarkdown());
    }

    return (
        <div>
            <div className="title-warp">
                <textarea
                    type="title"
                    placeholder="제목을 입력하세요."
                    className="title-style"
                ></textarea>
            </div>
            <Editor
                previewStyle="vertical"
                height="79vh"
                initialEditType="markdown"
                initialValue={`# H스타일\n * 목록 스타일\n `}
                ref={editorRef}
                plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
                onChange={onChangeEditorTextHandler}
            />
            <button
                variant="primary"
                type="submit"
                className="submitBtn"
            >Post</button>
            <button
                variant="primary"
                className="cancelBtn"
            >Cancel</button>
        </div>
    )
}

export default WritePage;