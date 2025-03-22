import React from 'react';
import { Icon } from '@iconify/react'; // 引入 Iconify 图标库

const Toolbar = ({ onShapeSelect, selectedShapeType, onDelete, hasSelectedShape }) => {
  const tools = [
    { type: 'rect', icon: 'mdi:rectangle-outline', label: '矩形' }, // 准确的矩形图标
    { type: 'circle', icon: 'mdi:circle-outline', label: '圆形' }, // 准确的圆形图标
    { type: 'star', icon: 'mdi:star-outline', label: '星星' }, // 准确的星星图标
    { type: 'heart', icon: 'mdi:heart-outline', label: '心形' }, // 准确的心形图标
    { type: 'triangle', icon: 'mdi:triangle-outline', label: '三角形' }, // 准确的三角形图标
    { type: 'sun', icon: 'mdi:weather-sunny', label: '太阳' }, // 准确的太阳图标
    { type: 'text', icon: 'mdi:format-text', label: '文字' }, // 准确的文字图标
  ];

  return (
    <div className="ml-2 w-15 p-2 flex-shrink-0 flex flex-col items-center gap-2 bg-gray-200 shadow-md">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => onShapeSelect(tool.type)}
          className={`p-2 rounded ${
            selectedShapeType === tool.type
              ? 'bg-gray-500 text-white'
              : 'text-gray-700 hover:bg-gray-400'
          }`}
          title={tool.label}
        >
          <Icon icon={tool.icon} width="20" height="20" />
        </button>
      ))}
      {/* 删除按钮 */}
      <button
        onClick={onDelete}
        className={`p-2 rounded ${
          hasSelectedShape
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        title="删除选中图形"
        disabled={!hasSelectedShape} // 无选中图形时禁用
      >
        <Icon icon="mdi:trash-can-outline" width="20" height="20" />
      </button>
    </div>
  );
};

export default Toolbar;