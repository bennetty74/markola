import React from 'react';
import { Icon } from '@iconify/react'; // 引入 Iconify 图标库

const Toolbar = ({ onShapeSelect, selectedShapeType, onDelete, hasSelectedShape }) => {
  const tools = [
    { type: 'rect', icon: 'mdi:rectangle-outline', label: '矩形' },
    { type: 'circle', icon: 'mdi:circle-outline', label: '圆形' },
    { type: 'star', icon: 'mdi:star-outline', label: '星星' },
    { type: 'ring', icon: 'mdi:ring', label: '环形' },
    { type: 'triangle', icon: 'mdi:triangle-outline', label: '三角形' },
    { type: 'sun', icon: 'mdi:weather-sunny', label: '太阳' },
    { type: 'text', icon: 'mdi:format-text', label: '文字' },
    { type: 'line', icon: 'mdi:minus', label: '线条' }, // 新增：线条工具
    { type: 'arrow', icon: 'mdi:arrow-right', label: '箭头' }, // 新增：箭头工具
  ];

  return (
    <div className="ml-2 w-15 p-2 flex-shrink-0 flex flex-col items-center gap-2 bg-gray-200 shadow-md">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => onShapeSelect(tool.type)}
          className={`p-1 rounded ${
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
        className={`p-1 rounded ${
          hasSelectedShape
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        title="删除选中图形"
        disabled={!hasSelectedShape}
      >
        <Icon icon="mdi:trash-can-outline" width="20" height="20" />
      </button>
    </div>
  );
};

export default Toolbar;