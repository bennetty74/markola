import React, { useRef, useEffect, useState } from "react";
import {
  FolderIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
  ChevronRightIcon,
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
  const ellipsisRef = useRef(null); // 新增用于定位省略号的 ref
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // 存储菜单位置


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        showDropdown === item.id
      ) {
        setShowDropdown(null);
      }

      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        (isRenaming || (newItemParentId === item.id && newItemType))
      ) {
        if (isRenaming) {
          cancelRename();
          setNewItemName("");
        }
        if (newItemParentId === item.id && newItemType) {
          setNewItemName("");
          confirmNewItem();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, item.id, setShowDropdown, isRenaming, newItemParentId, newItemType, cancelRename, setNewItemName, confirmNewItem]);

  const handleEllipsisClick = (e) => {
    const rect = ellipsisRef.current.getBoundingClientRect();
    setMenuPosition({
      x: rect.right, // 菜单出现在省略号右侧
      y: rect.top + window.scrollY, // 考虑页面滚动
    });
    setShowDropdown(showDropdown === item.id ? null : item.id);
  };


  return (
    <li className={`pl-${level * 4}`}>
      {item.type === "folder" ? (
        <div className="relative">
          {isRenaming ? (
            <div className="flex items-center" ref={inputRef}>
              <div className="w-4 mr-1" /> {/* 占位符，与展开图标对齐 */}
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
              <ChevronRightIcon
                className={`w-4 h-4 mr-1 transform transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
                onClick={() => toggleFolder(item.id)}
              />
              <span
                onClick={() => toggleFolder(item.id)}
                className="flex items-center flex-1"
              >
                <FolderIcon className="w-5 h-5 mr-2" /> {item.name}
              </span>
              <EllipsisHorizontalIcon
              ref={ellipsisRef}
                className="w-4 h-4 mr-2 cursor-pointer"
                onClick={handleEllipsisClick}
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
                position={menuPosition}
              />
            </div>
          )}
          {isExpanded && (
            <ul>
              {newItemParentId === item.id && newItemType && (
                <li className={`pl-${(level + 1) * 4}`} ref={inputRef}>
                  <div className="flex items-center">
                    <div className="w-4 mr-1" /> {/* 占位符 */}
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
                  </div>
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
              <div className="w-4 mr-1" /> {/* 与文件夹的展开图标对齐 */}
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
              <div className="w-4 mr-1" /> {/* 与文件夹的展开图标对齐 */}
              <DocumentIcon className="w-5 h-5 mr-2" />
              <span
                onClick={() => onFileSelect && onFileSelect(item)} // 添加检查
                className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {item.name}
              </span>
              <EllipsisHorizontalIcon
              ref={ellipsisRef}
                className="w-4 h-4 mr-2 cursor-pointer"
                onClick={handleEllipsisClick}
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
                position={menuPosition}
              />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default TreeNode;