// EditorConfig.js
import StarterKit from "@tiptap/starter-kit";
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
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockComponent from "../codeblock/CodeBlockComponent.jsx";
import ImageUploadComponent from "../image/ImageUploadComponent.jsx";
import { MathBlock, MathInline } from '../math/MathNode';

export const editorConfig = {
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      bulletList: true,
      orderedList: true,
    }),
    MathBlock,
    MathInline,
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
            tag: "img[src]",
            getAttrs: (dom) => {
              const src = dom.getAttribute("src");
              return {
                src,
                alt: dom.getAttribute("alt") || "Uploaded",
                title: dom.getAttribute("title") || null,
                isPlaceholder: !src || src === "",
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
};