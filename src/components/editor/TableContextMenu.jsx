import React from "react";
import {
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const TableContextMenu = React.forwardRef(({ editor, contextMenu, setContextMenu, theme }, ref) => {
  if (!contextMenu) return null;

  const menuItems = [
    {
      label: "在上面添加行",
      icon: <ArrowUpIcon className="w-4 h-4 mr-2" />,
      action: () => {
        console.log("click up");
        console.log("Can add row before?", editor.can().addRowBefore());
        editor.chain().focus().addRowBefore().run();
      },
      isDisabled: !editor.can().addRowBefore(),
      className: "rounded-t-lg",
    },
    {
      label: "在下面添加行",
      icon: <ArrowDownIcon className="w-4 h-4 mr-2" />,
      action: () => editor.chain().focus().addRowAfter().run(),
      isDisabled: !editor.can().addRowAfter(),
    },
    {
      label: "在前面添加列",
      icon: <ArrowLeftIcon className="w-4 h-4 mr-2" />,
      action: () => editor.chain().focus().addColumnBefore().run(),
      isDisabled: !editor.can().addColumnBefore(),
    },
    {
      label: "在后面添加列",
      icon: <ArrowRightIcon className="w-4 h-4 mr-2" />,
      action: () => editor.chain().focus().addColumnAfter().run(),
      isDisabled: !editor.can().addColumnAfter(),
    },
    {
      label: "删除当前行",
      icon: <TrashIcon className="w-4 h-4 mr-2" />,
      action: () => editor.chain().focus().deleteRow().run(),
      isDisabled: !editor.can().deleteRow(),
    },
    {
      label: "删除当前列",
      icon: <TrashIcon className="w-4 h-4 mr-2" />,
      action: () => editor.chain().focus().deleteColumn().run(),
      isDisabled: !editor.can().deleteColumn(),
      className: "rounded-b-lg",
    },
  ];

  return (
    <div
      ref={ref} // 绑定 ref
      className={`absolute z-[10000] w-40 rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
      }`}
      style={{ top: contextMenu.y, left: contextMenu.x}} // 调试边框
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            console.log(`Clicked: ${item.label}`);
            item.action();
            setContextMenu(null);
          }}
          className={`w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white flex items-center ${
            item.className || ""
          }`}
          disabled={item.isDisabled}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </div>
  );
});

export default TableContextMenu;