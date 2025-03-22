import React, { useState } from 'react';

const ShapeToolbar = ({ shape, updateShape, position, onMoveUp, onMoveDown }) => {
  const [showFillColors, setShowFillColors] = useState(false);
  const [showStrokeColors, setShowStrokeColors] = useState(false);

  // 预定义的颜色模板
  const colorOptions = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
    '#00FFFF', '#FFA500', '#800080', '#008000', '#000000',
  ];

  const handleFillChange = (color) => {
    updateShape({ ...shape, fill: color });
    setShowFillColors(false);
  };

  const handleStrokeChange = (color) => {
    updateShape({ ...shape, stroke: color, strokeWidth: shape.strokeWidth || 2 });
    setShowStrokeColors(false);
  };

  const handleStrokeWidthChange = (e) => {
    const width = parseInt(e.target.value, 10);
    if (!isNaN(width) && width >= 0) {
      updateShape({ ...shape, strokeWidth: width });
    }
  };

  return (
    <div
      className="absolute flex gap-2 p-2 bg-white border border-gray-300 rounded shadow-md"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 60}px`,
      }}
    >
      {/* 填充颜色 */}
      <div className="relative flex items-center gap-1">
        <button
          className="p-1 border rounded"
          style={{ backgroundColor: shape.fill || '#000000' }}
          onClick={() => setShowFillColors(!showFillColors)}
        >
          填充
        </button>
        {showFillColors && (
          <div className="absolute top-8 left-0 flex gap-1 p-2 bg-white border rounded shadow-md z-10">
            {colorOptions.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: color }}
                onClick={() => handleFillChange(color)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 边框颜色 */}
      <div className="relative flex items-center gap-1">
        <button
          className="p-1 border rounded"
          style={{ backgroundColor: shape.stroke || '#000000' }}
          onClick={() => setShowStrokeColors(!showStrokeColors)}
        >
          边框
        </button>
        {showStrokeColors && (
          <div className="absolute top-8 left-0 flex gap-1 p-2 bg-white border rounded shadow-md z-10">
            {colorOptions.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: color }}
                onClick={() => handleStrokeChange(color)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 边框宽度 */}
      <div className="flex items-center gap-1">
        <label htmlFor="strokeWidth" className="text-sm">宽度:</label>
        <input
          id="strokeWidth"
          type="number"
          min="0"
          value={shape.strokeWidth || 2}
          onChange={handleStrokeWidthChange}
          className="w-12 p-1 border rounded"
        />
      </div>

      {/* 上移和下移按钮 */}
      <div className="flex items-center gap-1">
        <button
          className="p-1 border rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => onMoveUp(shape.id)}
          title="上移"
        >
          ↑
        </button>
        <button
          className="p-1 border rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => onMoveDown(shape.id)}
          title="下移"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default ShapeToolbar;