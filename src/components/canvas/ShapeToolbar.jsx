import React, { useState } from 'react';
import { 
  PaintBrushIcon, 
  AdjustmentsHorizontalIcon, 
  PencilIcon, 
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { TbLayersSubtract } from "react-icons/tb";

const ShapeToolbar = ({ shape, updateShape, position, onMoveUp, onMoveDown }) => {
  const [showFillColors, setShowFillColors] = useState(false);
  const [showStrokeOptions, setShowStrokeOptions] = useState(false);
  const [showTextOptions, setShowTextOptions] = useState(false);
  const [showLayerOptions, setShowLayerOptions] = useState(false);

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

  const handleStrokeWidthChange = (value) => {
    updateShape({ ...shape, strokeWidth: value });
  };

  const handleFontSizeChange = (value) => {
    updateShape({ ...shape, fontSize: value });
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

  const handleUnderlineToggle = () => {
    const currentDecoration = shape.textDecoration || '';
    const isUnderlined = currentDecoration.includes('underline');
    const newDecoration = isUnderlined 
      ? currentDecoration.replace('underline', '').trim() 
      : `${currentDecoration} underline`.trim();
    updateShape({ ...shape, textDecoration: newDecoration || 'none' });
  };

  const handleStrikethroughToggle = () => {
    const currentDecoration = shape.textDecoration || '';
    const isStriked = currentDecoration.includes('line-through');
    const newDecoration = isStriked 
      ? currentDecoration.replace('line-through', '').trim() 
      : `${currentDecoration} line-through`.trim();
    updateShape({ ...shape, textDecoration: newDecoration || 'none' });
  };

  // 支持填充的形状
  const hasFill = !['text', 'line', 'arrow'].includes(shape.type);
  // 支持文字的形状
  const hasText = ['text', 'rect', 'circle', 'star', 'ring', 'triangle', 'sun'].includes(shape.type);

  const DropdownPanel = ({ children, className = '' }) => (
    <div className={`absolute top-full left-0 mt-2 w-56 bg-gray-100 border border-gray-300 rounded-lg shadow-md p-3 z-10 animate-fade-in ${className}`}>
      {children}
    </div>
  );

  const ColorGrid = ({ colors, onColorSelect }) => (
    <div className="grid grid-cols-5 gap-2">
      {colors.map((color) => (
        <button
          key={color}
          className="w-8 h-8 rounded-full hover:scale-110 transition-transform focus:outline-none"
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
          title={color}
        />
      ))}
    </div>
  );

  const TextOptions = () => {
    const [showTextFillColors, setShowTextFillColors] = useState(false);

    return (
      <DropdownPanel>
        <div className="space-y-3">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 w-full justify-between"
              style={{ backgroundColor: shape.textFill || shape.fill || '#000000' }}
              onClick={() => setShowTextFillColors(!showTextFillColors)}
            >
              <span className="flex items-center gap-2">
                <PencilIcon className="w-4 h-4" />
                文字颜色
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {showTextFillColors && (
              <div className="mt-2">
                <ColorGrid 
                  colors={colorOptions} 
                  onColorSelect={(color) => {
                    handleTextFillChange(color);
                    setShowTextFillColors(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">字号: {shape.fontSize || 20}px</label>
            <input
              type="range"
              min="8"
              max="72"
              value={shape.fontSize || 20}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-3 py-1 text-sm font-bold rounded-md ${
                shape.fontStyle?.includes('bold') ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={handleBoldToggle}
            >
              B
            </button>
            <button
              className={`px-3 py-1 text-sm italic rounded-md ${
                shape.fontStyle?.includes('italic') ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={handleItalicToggle}
            >
              I
            </button>
            <button
              className={`px-3 py-1 text-sm underline rounded-md ${
                shape.textDecoration?.includes('underline') ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={handleUnderlineToggle}
            >
              U
            </button>
            <button
              className={`px-3 py-1 text-sm line-through rounded-md ${
                shape.textDecoration?.includes('line-through') ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={handleStrikethroughToggle}
            >
              S
            </button>
          </div>
        </div>
      </DropdownPanel>
    );
  };

  const StrokeOptions = () => {
    const [showStrokeColors, setShowStrokeColors] = useState(false);

    return (
      <DropdownPanel>
        <div className="space-y-3">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 w-full justify-between"
              style={{ backgroundColor: shape.stroke || '#000000' }}
              onClick={() => setShowStrokeColors(!showStrokeColors)}
            >
              <span className="flex items-center gap-2">
                <PaintBrushIcon className="w-4 h-4" />
                {['line', 'arrow'].includes(shape.type) ? '线条颜色' : '边框颜色'}
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {showStrokeColors && (
              <div className="mt-2">
                <ColorGrid 
                  colors={colorOptions} 
                  onColorSelect={(color) => {
                    handleStrokeChange(color);
                    setShowStrokeColors(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              {['line', 'arrow'].includes(shape.type) ? '线条宽度' : '边框宽度'}: {shape.strokeWidth || 2}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={shape.strokeWidth || 2}
              onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </DropdownPanel>
    );
  };

  return (
    <div
      className="absolute flex flex-wrap gap-2 p-3 bg-gradient-to-br from-[#f5f1eb] to-[#e8e3db] border border-gray-300 rounded-lg shadow-lg"
      style={{ left: `${position.x}px`, top: `${position.y - 70}px` }}
    >
      {hasFill && (
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            style={{ backgroundColor: shape.fill || '#000000' }}
            onClick={() => setShowFillColors(!showFillColors)}
          >
            <PaintBrushIcon className="w-4 h-4" />
            填充
          </button>
          {showFillColors && (
            <DropdownPanel>
              <ColorGrid colors={colorOptions} onColorSelect={handleFillChange} />
            </DropdownPanel>
          )}
        </div>
      )}

      {/* 边框选项始终显示 */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => setShowStrokeOptions(!showStrokeOptions)}
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          {['line', 'arrow'].includes(shape.type) ? '线条' : '边框'}
        </button>
        {showStrokeOptions && <StrokeOptions />}
      </div>

      {hasText && (
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => setShowTextOptions(!showTextOptions)}
          >
            <PencilIcon className="w-4 h-4" />
            文字
          </button>
          {showTextOptions && <TextOptions />}
        </div>
      )}

      {/* 层级选项始终显示 */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => setShowLayerOptions(!showLayerOptions)}
        >
          <TbLayersSubtract className="w-4 h-4" />
          层级
        </button>
        {showLayerOptions && (
          <DropdownPanel>
            <div className="space-y-2">
              <button
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 w-full"
                onClick={() => onMoveUp(shape.id)}
              >
                <ArrowUpIcon className="w-4 h-4" />
                上移
              </button>
              <button
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 w-full"
                onClick={() => onMoveDown(shape.id)}
              >
                <ArrowDownIcon className="w-4 h-4" />
                下移
              </button>
            </div>
          </DropdownPanel>
        )}
      </div>
    </div>
  );
};

export default ShapeToolbar;