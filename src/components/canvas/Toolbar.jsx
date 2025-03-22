import React from 'react';
import { TbStar, TbCircle, TbTriangle , TbRectangle, TbTextResize, TbPencil, TbArrowNarrowRight, TbTrash} from "react-icons/tb";

const Toolbar = ({ onShapeSelect, selectedShapeType, onDelete, hasSelectedShape }) => {

const tools = [
  { type: 'rect', icon: <TbRectangle className='w-6 h-6'/>, label: '矩形' },
  { type: 'circle', icon: <TbCircle className='w-6 h-6'/>, label: '圆形' },
  { type: 'star', icon: <TbStar className='w-6 h-6'/>, label: '星星' },
  { type: 'triangle', icon:  <TbTriangle className='w-6 h-6'/>, label: '三角形' },
  { type: 'text', icon: <TbTextResize className='w-6 h-6'/>, label: '文字' },
  { type: 'line', icon: <TbPencil className='w-6 h-6'/>, label: '线条' },
  { type: 'arrow', icon: <TbArrowNarrowRight className='w-6 h-6'/>, label: '箭头' },
];

  return (
    <div className="ml-2 p-2 rounded-lg flex-shrink-0 flex flex-col items-center gap-2 bg-gray-100 shadow-lg">
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
          {tool.icon}
        </button>
      ))}
      {/* 删除按钮 */}
      <button
        onClick={onDelete}
        className={`p-1 rounded ${
          hasSelectedShape
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'text-gray-500 cursor-not-allowed'
        }`}
        title="删除选中图形"
        disabled={!hasSelectedShape}
      >
        <TbTrash className='w-6 h-6' />
      </button>
    </div>
  );
};

export default Toolbar;