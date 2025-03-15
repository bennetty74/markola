// MarkdownEditor.js
import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import debounce from "lodash/debounce";
import Toolbar from "./EditorToolbar.jsx";
import TableContextMenu from "./editor/TableContextMenu";
import { editorConfig } from "./editor/EditorConfig";
import "katex/dist/katex.min.css";

function MarkdownEditor({ onContentChange, initialContent, theme, setSelectedFile }) {
  const [contextMenu, setContextMenu] = useState(null);
  const editorRef = useRef(null);
  const lastContentRef = useRef(initialContent);

  const editor = useEditor({
    extensions: editorConfig.extensions,
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastContentRef.current = html;
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

  useEffect(() => {
    if (editor && initialContent !== undefined) {
      updateContent(initialContent, editor);
    }
    return () => updateContent.cancel();
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

  useEffect(() => {
    document.addEventListener("click", () => setContextMenu(null));
    return () => document.removeEventListener("click", () => setContextMenu(null));
  }, []);

  return (
    <div
      className="w-full h-full relative"
      ref={editorRef}
      onContextMenu={handleContextMenu}
    >
      <EditorContent
        editor={editor}
        className={`p-8 z-automax-w-none mt-[65px] ${
          theme === "dark" ? "prose-invert" : ""
        }`}
      />
      <TableContextMenu
        editor={editor}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        theme={theme}
      />
      <Toolbar
        className="z-9999"
        editor={editor}
        theme={theme}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
}

export default MarkdownEditor;