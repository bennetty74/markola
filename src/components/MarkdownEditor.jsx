import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import debounce from "lodash/debounce";
import Toolbar from "./EditorToolbar.jsx";
import TableContextMenu from "./editor/TableContextMenu";
import { editorConfig } from "./editor/EditorConfig";
import "katex/dist/katex.min.css";

function MarkdownEditor({
  onContentChange,
  initialContent,
  theme,
  setSelectedFile,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const editorRef = useRef(null);
  const menuRef = useRef(null); // 添加对 TableContextMenu 的引用
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
      currentEditor.commands.setContent(content, false, {
        preserveCursor: true,
      });
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
    console.log("handleContextMenu triggered", event);
    if (!editor) {
      console.log("Editor not initialized");
      return;
    }

    event.preventDefault();
    if (editor.isActive("table")) {
      editor.commands.focus();
      const editorRect = editorRef.current.getBoundingClientRect();
      const x = event.clientX - editorRect.left;
      const y = event.clientY - editorRect.top;
      console.log("Menu position:", { x, y });
      setContextMenu({ x, y });
    } else {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        console.log("Click outside menu, closing context menu");
        setContextMenu(null);
      } else {
        console.log("Click inside menu, keeping context menu open");
      }
    };
    document.addEventListener("click", handleClickOutside, false);
    return () =>
      document.removeEventListener("click", handleClickOutside, false);
  }, [contextMenu]);

  return (
    <div className="w-full h-full flex flex-col">
      <Toolbar
        className="z-50"
        editor={editor}
        theme={theme}
        setSelectedFile={setSelectedFile}
      />
      <div
        className="flex-1 overflow-y-auto relative"
        ref={editorRef}
        onContextMenu={handleContextMenu}
      >
        <EditorContent editor={editor} className={`p-8 max-w-none mt-1`} />
      </div>
      {contextMenu && (
        <TableContextMenu
          editor={editor}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          theme={theme}
          ref={menuRef} // 传递 ref
        />
      )}
    </div>
  );
}

export default MarkdownEditor;
