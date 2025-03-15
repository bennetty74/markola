// ContextMenu.js
import React from "react";
import {
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const TableContextMenu = ({ editor, contextMenu, setContextMenu, theme }) => {
  if (!contextMenu) return null;

  return (
    <div
      className={`absolute z-10 w-60 rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
      }`}
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      <button
        onClick={() => {
          editor.chain().focus().addRowBefore().run();
          setContextMenu(null);
        }}
        className={`w-full text-left px-4 py-2 hover:${
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
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
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
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
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
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
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
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
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
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
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
        } flex items-center rounded-b-lg`}
        disabled={!editor.can().deleteColumn()}
      >
        <TrashIcon className="w-4 h-4 mr-2" /> 删除当前列
      </button>
    </div>
  );
};

export default TableContextMenu;