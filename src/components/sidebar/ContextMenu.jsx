import React from 'react';
import {
  DocumentIcon,
  FolderIcon,
  EyeDropperIcon,
  ArchiveBoxXMarkIcon,
} from '@heroicons/react/24/outline';

const ContextMenu = ({
  item,
  startNewItem,
  startRename,
  deleteItem,
  exportToPDF,
  exportToHTML,
  isExporting,
}) => {
  return (
    <div className="absolute left-0 top-full mt-1 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg z-50 w-40">
      {item.type === 'folder' && (
        <>
          <button
            onClick={() => startNewItem(item.id, 'file')}
            className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white rounded-t-lg flex items-center"
          >
            <DocumentIcon className="w-5 h-5 mr-2" /> 新建文件
          </button>
          <button
            onClick={() => startNewItem(item.id, 'folder')}
            className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white flex items-center"
          >
            <FolderIcon className="w-5 h-5 mr-2" /> 新建分组
          </button>
        </>
      )}
      <button
        onClick={() => startRename(item.id, item.name)}
        className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white flex items-center"
      >
        <EyeDropperIcon className="w-5 h-5 mr-2" /> 重命名
      </button>
      {item.type === 'file' && (
        <>
          <button
            onClick={() => exportToPDF(item)}
            disabled={isExporting}
            className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white flex items-center disabled:opacity-50"
          >
            <DocumentIcon className="w-5 h-5 mr-2" /> 导出PDF
          </button>
          <button
            onClick={() => exportToHTML(item)}
            className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white flex items-center"
          >
            <DocumentIcon className="w-5 h-5 mr-2" /> 导出HTML
          </button>
        </>
      )}
      <button
        onClick={() => deleteItem(item.id)}
        className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white rounded-b-lg flex items-center text-red-400"
      >
        <ArchiveBoxXMarkIcon className="w-5 h-5 mr-2" />{' '}
        {item.type === 'folder' ? '删除分组' : '删除文件'}
      </button>
    </div>
  );
};

export default ContextMenu;