import React,{useState,useEffect} from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    // 受控富文本组件
    const [editorState, setEditorState] = useState("")
    // 接收父亲传递的editorData(html)，转化为Draft。这个只用于NewsUpdate组件，不用于NewsAdd组件
    useEffect(()=>{
        // 防止NewsAdd接收到的editorData为空而报错
        //这种情况只会在父项是NewsAdd时会发生
        if(props.editorData===undefined) return
        const contentBlock = htmlToDraft(props.editorData);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const OldeditorState = EditorState.createWithContent(contentState);
          setEditorState(OldeditorState)
        }
    },[props.editorData])
    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={(editorState)=>setEditorState(editorState)}
                // 失去焦点，以html的形式向父项传递富文本数据
                onBlur={()=>{
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
                localization={{
                    locale:'zh'
                }}
            />
        </div>
    )
}
