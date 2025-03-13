import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { lowlight } from "lowlight";
import Toolbar from "./EditorToolbar.jsx";
import CodeBlockComponent from "./codeblock/CodeBlockComponent.jsx";
import ImageUploadComponent from "./image/ImageUploadComponent.jsx";
import debounce from 'lodash/debounce';
import {
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import 'katex/dist/katex.min.css';
import {MathBlock, MathInline} from './math/MathNode';

function MarkdownEditor({ onContentChange, initialContent, theme, setSelectedFile }) {
  const [contextMenu, setContextMenu] = useState(null);
  const editorRef = useRef(null);
  const lastContentRef = useRef(initialContent); // 记录最后的内容，避免重复 setContent

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: true,
        orderedList: true,
      }),
      MathBlock, // 块级公式
      MathInline, // 行内公式,
      Markdown.configure({
        html: true,
        transformPastedText: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }),
      Blockquote,
      Link.configure({ openOnClick: true }),
      Image.extend({
        addAttributes() {
          return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            isPlaceholder: { default: false },
          };
        },
        addNodeView() {
          return ReactNodeViewRenderer(ImageUploadComponent);
        },
        parseHTML() {
          return [
            {
              tag: "img[src]", // 匹配 <img> 标签
              getAttrs: (dom) => {
                const src = dom.getAttribute("src");
                return {
                  src,
                  alt: dom.getAttribute("alt") || "Uploaded",
                  title: dom.getAttribute("title") || null,
                  isPlaceholder: !src || src === "", // 如果没有 src，则视为占位符
                };
              },
            },
          ];
        },
        renderHTML({ node }) {
          return [
            "img",
            {
              src: node.attrs.src,
              alt: node.attrs.alt,
              title: node.attrs.title,
              "data-is-placeholder": node.attrs.isPlaceholder,
            },
          ];
        },
      }),
      Underline,
      Strike,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastContentRef.current = html; // 更新最后内容
      onContentChange(html);
    },
    onCreate: ({ editor }) => {
      console.log("Editor created:", editor);
    },
  });

  const updateContent = debounce((content, currentEditor) => {
    if (content !== lastContentRef.current) {
      console.log("Loading initialContent:", content);
      const currentPos = currentEditor.state.selection.anchor;
      currentEditor.commands.setContent(content, false, { preserveCursor: true });
      currentEditor.commands.setTextSelection(currentPos);
      lastContentRef.current = content;
    }
  }, 100);

  // 初始化或外部内容变化时更新编辑器内容
  useEffect(() => {
    if (editor && initialContent !== undefined) {
      updateContent(initialContent, editor);
    }
    return () => updateContent.cancel(); // 清理防抖
  }, [editor, initialContent]);

  const handleContextMenu = (event) => {
    if (!editor) return;

    event.preventDefault();
    if (editor.isActive("table")) {
      const editorRect = editorRef.current.getBoundingClientRect();
      const x = event.pageX - editorRect.left;
      const y = event.pageY - editorRect.top + window.scrollY;

      const menuWidth = 192;
      const menuHeight = 6 * 40;
      const adjustedX = x + menuWidth > editorRect.width ? x - menuWidth : x;
      const adjustedY =
        y + menuHeight > editorRect.height + window.scrollY
          ? y - menuHeight
          : y;

      setContextMenu({ x: adjustedX, y: adjustedY });
    } else {
      setContextMenu(null);
    }
  };

  const handleClickOutside = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className={`w-full h-full relative`}
      ref={editorRef}
      onContextMenu={handleContextMenu}
    >
      <EditorContent
        editor={editor}
        className={`p-2 z-auto prose-sm max-w-none mt-[65px] ${
          theme === "dark" ? "prose-invert" : ""
        }`}
      />
      {contextMenu && (
        <div
          className={`absolute z-10 w-60 rounded-lg shadow-lg ${
            theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-100 text-black"
          }`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
              setContextMenu(null);
            }}
            className={`w-full text-left px-4 py-2 hover:${
              theme === "dark" ? "bg-gray-600" : "bg-gray-100"
            } flex items-center rounded-t-lg`}
            disabled={!editor.can().addRowBefore()}
          >
            <ArrowUpIcon className="w-4 h-4 mr-2" /> 在上面添加行
          </button>
          <button
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
              setContextMenu(null);
            }}
            className={`w-full text-left px-4 py-2 hover:${
              theme === "dark" ? "bg-gray-600" : "bg-gray-100"
            } flex items-center`}
            disabled={!editor.can().addRowAfter()}
          >
            <ArrowDownIcon className="w-4 h-4 mr-2" /> 在下面添加行
          </button>
          <button
            onClick={() => {
              editor.chain().focus().addColumnBefore().run();
              setContextMenu(null);
            }}
            className={`w-full text-left px-4 py-2 hover:${
              theme === "dark" ? "bg-gray-600" : "bg-gray-100"
            } flex items-center`}
            disabled={!editor.can().addColumnBefore()}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> 在前面添加列
          </button>
          <button
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
              setContextMenu(null);
            }}
            className={`w-full text-left px-4 py-2 hover:${
              theme === "dark" ? "bg-gray-600" : "bg-gray-100"
            } flex items-center`}
            disabled={!editor.can().addColumnAfter()}
          >
            <ArrowRightIcon className="w-4 h-4 mr-2" /> 在后面添加列
          </button>
          <button
            onClick={() => {
              editor.chain().focus().deleteRow().run();
              setContextMenu(null);
            }}
            className={`w-full text-left px-4 py-2 hover:${
              theme === "dark" ? "bg-gray-600" : "bg-gray-100"
            } flex items-center`}
            disabled={!editor.can().deleteRow()}
          >
            <TrashIcon className="w-4 h-4 mr-2" /> 删除当前行
          </button>
          <button
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
              setContextMenu(null);
            }}
            className={`w-full text-left px-4 py-2 hover:${
              theme === "dark" ? "bg-gray-600" : "bg-gray-100"
            } flex items-center rounded-b-lg`}
            disabled={!editor.can().deleteColumn()}
          >
            <TrashIcon className="w-4 h-4 mr-2" /> 删除当前列
          </button>
        </div>
      )}

      <Toolbar className="z-9999" editor={editor} theme={theme} setSelectedFile={setSelectedFile}/>
    </div>
  );
}

export default MarkdownEditor;
