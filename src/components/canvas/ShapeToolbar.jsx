import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const ShapeToolbar = ({ shape, updateShape, position, onMoveUp, onMoveDown }) => {
  const [showFillColors, setShowFillColors] = useState(false);
  const [showStrokeOptions, setShowStrokeOptions] = useState(false); // 新增：边框选项下拉
  const [showTextOptions, setShowTextOptions] = useState(false); // 文字选项下拉
  const [showLayerOptions, setShowLayerOptions] = useState(false); // 层级选项下拉

  // 20组协调颜色
  const colorOptions = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#e8e3db', '#998f80', '#2c2721',
  ];

  const handleFillChange = (color) => {
    updateShape({ ...shape, fill: color });
    setShowFillColors(false);
  };

  const handleStrokeChange = (color) => {
    updateShape({ ...shape, stroke: color, strokeWidth: shape.strokeWidth || 2 });
  };

  const handleTextFillChange = (color) => {
    updateShape({ ...shape, textFill: color });
  };

  const handleStrokeWidthChange = (e) => {
    const width = parseInt(e.target.value, 10);
    if (!isNaN(width) && width >= 0) {
      updateShape({ ...shape, strokeWidth: width });
    }
  };

  const handleFontSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size) && size > 0) {
      updateShape({ ...shape, fontSize: size });
    }
  };

  const handleBoldToggle = () => {
    const currentStyle = shape.fontStyle || 'normal';
    const isBold = currentStyle.includes('bold');
    const newStyle = isBold ? currentStyle.replace('bold', '').trim() : `${currentStyle} bold`.trim();
    updateShape({ ...shape, fontStyle: newStyle || 'normal' });
  };

  const handleItalicToggle = () => {
    const currentStyle = shape.fontStyle || 'normal';
    const isItalic = currentStyle.includes('italic');
    const newStyle = isItalic ? currentStyle.replace('italic', '').trim() : `${currentStyle} italic`.trim();
    updateShape({ ...shape, fontStyle: newStyle || 'normal' });
  };

  const isTextOnly = shape.type === 'text';

  // 文字选项组件
  const TextOptions = () => {
    const [showTextFillColors, setShowTextFillColors] = useState(false);

    return (
      <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
        <div className="relative mb-2">
          <button
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            style={{ backgroundColor: shape.textFill || shape.fill || '#000000' }}
            onClick={() => setShowTextFillColors(!showTextFillColors)}
          >
            <Icon icon="mdi:format-color-text" width="16" />
            颜色
          </button>
          {showTextFillColors && (
            <div className="absolute top-full left-0 mt-1 grid grid-cols-5 gap-1 p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md z-20 animate-popup-fade-in">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleTextFillChange(color);
                    setShowTextFillColors(false);
                  }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 mb-2">
          <label htmlFor="fontSize" className="text-sm text-gray-600">字号:</label>
          <input
            id="fontSize"
            type="number"
            min="1"
            value={shape.fontSize || 20}
            onChange={handleFontSizeChange}
            className="w-12 p-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex gap-1">
          <button
            className={`px-2 py-1 text-sm font-bold text-gray-700 rounded-md ${
              shape.fontStyle?.includes('bold') ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={handleBoldToggle}
            title="加粗"
          >
            B
          </button>
          <button
            className={`px-2 py-1 text-sm italic text-gray-700 rounded-md ${
              shape.fontStyle?.includes('italic') ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={handleItalicToggle}
            title="斜体"
          >
            I
          </button>
        </div>
      </div>
    );
  };

  // 边框选项组件
  const StrokeOptions = () => {
    const [showStrokeColors, setShowStrokeColors] = useState(false); // 局部状态

    return (
      <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
        {/* 边框颜色 */}
        <div className="relative mb-2">
          <button
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            style={{ backgroundColor: shape.stroke || '#000000' }}
            onClick={() => setShowStrokeColors(!showStrokeColors)}
          >
            <Icon icon="mdi:palette" width="16" />
            颜色
          </button>
          {showStrokeColors && (
            <div className="absolute top-full left-0 mt-1 grid grid-cols-5 gap-1 p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md z-20 animate-popup-fade-in">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleStrokeChange(color);
                    setShowStrokeColors(false);
                  }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
        {/* 边框宽度 */}
        <div className="flex items-center gap-1">
          <label htmlFor="strokeWidth" className="text-sm text-gray-600">宽度:</label>
          <input
            id="strokeWidth"
            type="number"
            min="0"
            value={shape.strokeWidth || 2}
            onChange={handleStrokeWidthChange}
            className="w-12 p-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className="absolute flex flex-wrap gap-2 p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 70}px`,
        background: 'linear-gradient(135deg, #f5f1eb, #e8e3db)', // gray-100 到 gray-200
      }}
    >
      {/* 图形填充颜色 */}
      {!isTextOnly && (
        <div className="relative">
          <button
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
            style={{ backgroundColor: shape.fill || '#000000' }}
            onClick={() => setShowFillColors(!showFillColors)}
          >
            <Icon icon="mdi:palette" width="16" />
            填充
          </button>
          {showFillColors && (
            <div className="absolute top-full left-0 mt-1 grid grid-cols-5 gap-1 p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md z-10 animate-popup-fade-in">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleFillChange(color)}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 边框选项 */}
      {!isTextOnly && (
        <div className="relative">
          <button
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
            onClick={() => setShowStrokeOptions(!showStrokeOptions)}
          >
            <Icon icon="mdi:border-style" width="16" />
            边框
          </button>
          {showStrokeOptions && (
            <div className="absolute top-full left-0 mt-1 z-10 animate-popup-fade-in">
              <StrokeOptions />
            </div>
          )}
        </div>
      )}

      {/* 文字选项 */}
      <div className="relative">
        <button
          className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
          onClick={() => setShowTextOptions(!showTextOptions)}
        >
          <Icon icon="mdi:text" width="16" />
          文字
        </button>
        {showTextOptions && (
          <div className="absolute top-full left-0 mt-1 z-10 animate-popup-fade-in">
            <TextOptions />
          </div>
        )}
      </div>

      {/* 层级移动 */}
      <div className="relative">
        <button
          className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
          onClick={() => setShowLayerOptions(!showLayerOptions)}
        >
          <Icon icon="mdi:layers" width="16" />
          层级
        </button>
        {showLayerOptions && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md z-10 animate-popup-fade-in">
            <button
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 w-full"
              onClick={() => onMoveUp(shape.id)}
            >
              <Icon icon="mdi:arrow-up" width="12" />
              上移
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 w-full mt-1"
              onClick={() => onMoveDown(shape.id)}
            >
              <Icon icon="mdi:arrow-down" width="12" />
              下移
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeToolbar;