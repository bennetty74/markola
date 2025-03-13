import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import projectCSS from '../index.css?raw';
import SidebarHeader from './sidebar/SidebarHeader';
import TreeNode from './sidebar/TreeNode';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"; // 添加展开/收起图标

function NotebookSidebar({
  selectedFile,
  onFileSelect,
  tree,
  setTree,
  theme,
  toggleTheme,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState(null);
  const [newItemParentId, setNewItemParentId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef(null);

  // 切换文件夹展开状态
  const toggleFolder = (id) => {
    setExpandedFolders((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
      return newExpanded;
    });
  };

  // 删除节点
  const deleteItem = (id) => {
    setTree(tree.filter((item) => item.id !== id));
    setShowDropdown(null);
  };

  // 开始新建
  const startNewItem = (parentId, type) => {
    setShowDropdown(null);
    setNewItemName('');
    setNewItemType(type);
    setNewItemParentId(parentId);
    if (parentId) {
      setExpandedFolders((prev) => new Set(prev).add(parentId));
    }
  };

  // 确认新建
  const confirmNewItem = () => {
    if (!newItemName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      type: newItemType,
      ...(newItemType === 'folder' ? { children: [] } : { content: `# ${newItemName}\n` }),
    };
    setTree((prev) =>
      newItemParentId
        ? prev.map((item) =>
            item.id === newItemParentId && item.type === 'folder'
              ? { ...item, children: [newItem, ...item.children] }
              : item
          )
        : [newItem, ...prev]
    );
    if (newItemType === 'file') onFileSelect(newItem);
    setNewItemName('');
    setNewItemType(null);
    setNewItemParentId(null);
  };

  // 开始重命名
  const startRename = (id, currentName) => {
    setRenamingId(id);
    setNewItemName(currentName);
    setShowDropdown(null);
  };

  // 确认重命名
  const confirmRename = (id) => {
    if (!newItemName.trim()) return cancelRename();
    const updateTree = (items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, name: newItemName }
          : item.type === 'folder'
          ? { ...item, children: updateTree(item.children) }
          : item
      );
    setTree(updateTree(tree));
    setRenamingId(null);
    setNewItemName('');
  };

  // 取消重命名
  const cancelRename = () => {
    setRenamingId(null);
    setNewItemName('');
  };

  // 导出为 PDF
  const exportToPDF = async (item) => {
    if (!window.electronAPI || item.type !== 'file') return;
    setIsExporting(true);
    try {
      const iframe = document.createElement('iframe');
      Object.assign(iframe.style, {
        position: 'absolute',
        width: '0',
        height: '0',
        border: 'none',
        visibility: 'hidden',
      });
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <style>${projectCSS} body { padding: 20px; margin: 0; } .tiptap { max-width: 100%; }</style>
          </head>
          <body class="tiptap">${item.content}</body>
        </html>
      `);
      iframeDoc.close();
      const opt = {
        margin: 10,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 210 * 3.78, windowHeight: 297 * 3.78 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      const pdfBlob = await html2pdf().from(iframeDoc.body).set(opt).output('blob');
      document.body.removeChild(iframe);
      const pdfArrayBuffer = await pdfBlob.arrayBuffer();
      const success = await window.electronAPI.savePDF(pdfArrayBuffer, item.name);
      console.log(success ? `Exported ${item.name} to PDF` : `Failed to export ${item.name} to PDF`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setIsExporting(false);
      setShowDropdown(null);
    }
  };

  // 导出为 HTML
  const exportToHTML = async (item) => {
    if (window.electronAPI && item.type === 'file') {
      const success = await window.electronAPI.exportToHTML(item.content, item.name);
      console.log(success ? `Exported ${item.name} to HTML` : `Failed to export ${item.name} to HTML`);
    }
    setShowDropdown(null);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // 搜索过滤
  const filterTree = (items, query) =>
    items
      .filter((item) => {
        if (item.type === 'file' && item.name.toLowerCase().includes(query.toLowerCase())) return true;
        if (item.type === 'folder') {
          const filteredChildren = filterTree(item.children, query);
          return filteredChildren.length > 0 || item.name.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      })
      .map((item) =>
        item.type === 'folder' ? { ...item, children: filterTree(item.children, query) } : item
      );

  const filteredTree = searchQuery ? filterTree(tree, searchQuery) : tree;

  return (
    <div className="w-full h-full p-4 relative" ref={dropdownRef}>
      <SidebarHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        startNewItem={startNewItem}
      />
      <ul className="space-y-1">
        {newItemParentId === null && newItemType && (
          <li>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={confirmNewItem}
              onKeyDown={(e) => e.key === 'Enter' && confirmNewItem()}
              placeholder={`新建名称`}
              className="w-full p-1 rounded bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </li>
        )}
        {filteredTree.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            level={0}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            toggleFolder={toggleFolder}
            expandedFolders={expandedFolders}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            renamingId={renamingId}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            startRename={startRename}
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
    </div>
  );
}

export default NotebookSidebar;