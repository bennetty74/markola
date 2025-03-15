import React, { useRef, useEffect } from "react";
import {
  FolderIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import ContextMenu from "./ContextMenu";

const TreeNode = ({
  item,
  level,
  selectedFile,
  onFileSelect,
  toggleFolder,
  expandedFolders,
  showDropdown,
  setShowDropdown,
  renamingId,
  newItemName,
  setNewItemName,
  startRename,
  confirmRename,
  cancelRename,
  startNewItem,
  deleteItem,
  exportToPDF,
  exportToHTML,
  newItemParentId,
  newItemType,
  confirmNewItem,
  isExporting,
}) => {
  const isRenaming = renamingId === item.id;
  const isExpanded = expandedFolders.has(item.id);
  const isSelected = selectedFile?.id === item.id;
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        showDropdown === item.id
      ) {
        setShowDropdown(null);
      }

      // 检查是否点击在输入框外部
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        (isRenaming || (newItemParentId === item.id && newItemType))
      ) {
        if (isRenaming) {
          cancelRename(); // 取消重命名
          setNewItemName(""); // 清除输入框内容
        }
        if (newItemParentId === item.id && newItemType) {
          setNewItemName(""); // 清除输入框内容
          confirmNewItem(); // 假设 confirmNewItem 会检查空值并取消新建
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, item.id, setShowDropdown]);

  return (
    <li className={`pl-${level * 4}`}>
      {item.type === "folder" ? (
        <div className="relative">
          {isRenaming ? (
            <div className="flex items-center" ref={inputRef}>
              <FolderIcon className="w-5 h-5 mr-2" />
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onBlur={() => confirmRename(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename(item.id);
                  if (e.key === "Escape") cancelRename();
                }}
                className="w-full p-1 rounded bg-gray-300 dark:bg-gray-800 focus:outline-none"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-700 hover:text-white rounded px-2 py-1 transition-colors">
              <span
                onClick={() => toggleFolder(item.id)}
                className="flex items-center flex-1"
              >
                <FolderIcon className="w-5 h-5 mr-2" /> {item.name}
              </span>
              <EllipsisHorizontalIcon
                className="w-4 h-4 mr-2 cursor-pointer"
                onClick={() =>
                  setShowDropdown(showDropdown === item.id ? null : item.id)
                }
              />
            </div>
          )}
          {showDropdown === item.id && (
            <div ref={dropdownRef}>
              <ContextMenu
                item={item}
                startNewItem={startNewItem}
                startRename={startRename}
                deleteItem={deleteItem}
                exportToPDF={exportToPDF}
                exportToHTML={exportToHTML}
                isExporting={isExporting}
              />
            </div>
          )}
          {isExpanded && (
            <ul>
              {newItemParentId === item.id && newItemType && (
                <li className={`pl-${(level + 1) * 4}`} ref={inputRef}>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onBlur={confirmNewItem}
                    onKeyDown={(e) => e.key === "Enter" && confirmNewItem()}
                    placeholder={`新建名称`}
                    className="w-full p-1 rounded bg-gray-300 dark:bg-gray-800 focus:outline-none"
                    autoFocus
                  />
                </li>
              )}
              {item.children.map((child) => (
                <TreeNode
                  key={child.id}
                  item={child}
                  level={level + 1}
                  selectedFile={selectedFile}
                  onFileSelect={onFileSelect}
                  toggleFolder={toggleFolder}
                  expandedFolders={expandedFolders}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  renamingId={renamingId}
                  newItemName={newItemName}
                  setNewItemName={setNewItemName}
                  confirmRename={confirmRename}
                  cancelRename={cancelRename}
                  startNewItem={startNewItem}
                  deleteItem={deleteItem}
                  exportToPDF={exportToPDF}
                  exportToHTML={exportToHTML}
                  newItemParentId={newItemParentId}
                  newItemType={newItemType}
                  confirmNewItem={confirmNewItem}
                  isExporting={isExporting}
                />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="relative">
          {isRenaming ? (
            <div className="flex items-center" ref={inputRef}>
              <DocumentIcon className="w-5 h-5 mr-2" />
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onBlur={() => confirmRename(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename(item.id);
                  if (e.key === "Escape") cancelRename();
                }}
                className="w-full p-1 rounded bg-gray-300 dark:bg-gray-800 focus:outline-none"
                autoFocus
              />
            </div>
          ) : (
            <div
              className={`flex items-center cursor-pointer hover:bg-gray-700 hover:text-white rounded px-2 py-1 transition-colors ${
                isSelected ? "bg-gray-600 text-white" : ""
              }`}
            >
              <DocumentIcon className="w-5 h-5 mr-2" />
              <span
                onClick={() => onFileSelect(item)}
                className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {item.name}
              </span>
              <EllipsisHorizontalIcon
                className="w-4 h-4 mr-2 cursor-pointer"
                onClick={() =>
                  setShowDropdown(showDropdown === item.id ? null : item.id)
                }
              />
            </div>
          )}
          {showDropdown === item.id && (
            <div ref={dropdownRef}>
              <ContextMenu
              item={item}
              startNewItem={startNewItem}
              startRename={startRename}
              deleteItem={deleteItem}
              exportToPDF={exportToPDF}
              exportToHTML={exportToHTML}
              isExporting={isExporting}
            />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default TreeNode;
