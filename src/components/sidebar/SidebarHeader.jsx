import React from 'react';
import { MagnifyingGlassIcon, PlusIcon,DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';

const SidebarHeader = ({
  searchQuery,
  setSearchQuery,
  showDropdown,
  setShowDropdown,
  startNewItem,
}) => {
  return (
    <div className="flex items-center mb-4 relative">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索文件..."
          className="w-full pl-8 p-2 rounded-l-lg bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
      <button
        className="p-2 h-[40px] rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setShowDropdown(showDropdown === 'root' ? null : 'root')}
      >
        <PlusIcon className="w-5 h-5" />
      </button>
      {showDropdown === 'root' && (
        <div className="absolute right-0 top-full mt-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg z-50 w-40">
          <button
            onClick={() => startNewItem(null, 'file')}
            className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white rounded-t-lg flex items-center"
          >
            <DocumentIcon className="w-5 h-5 mr-2" /> 新建文件
          </button>
          <button
            onClick={() => startNewItem(null, 'folder')}
            className="w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white rounded-b-lg flex items-center"
          >
            <FolderIcon className="w-5 h-5 mr-2" /> 新建分组
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;