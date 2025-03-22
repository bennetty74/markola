import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import Toolbar from './Toolbar';
import CanvasArea from './CanvasArea';

const CanvasComponent = ({ node, updateAttributes }) => {
  const [shapes, setShapes] = useState(node.attrs.shapes || []);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedShapeType, setSelectedShapeType] = useState(null);
  const [stageHeight, setStageHeight] = useState(node.attrs.height || 400);
  const [isCanvasSelected, setIsCanvasSelected] = useState(false);
  const wrapperRef = useRef(null);

  React.useEffect(() => {
    updateAttributes({ shapes, height: stageHeight });
  }, [shapes, stageHeight, updateAttributes]);

  // 点击外部取消选中
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsCanvasSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (selectedId) {
      setShapes(shapes.filter(shape => shape.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleCanvasClick = () => {
    setIsCanvasSelected(true);
  };

  return (
    <NodeViewWrapper className="canvas-node" ref={wrapperRef}>
      <div className="my-4 bg-gray-200 rounded-lg border border-gray-300 flex overflow-hidden">
        <div
          className="flex items-center justify-center transition-[width,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: isCanvasSelected ? '60px' : '0', // 假设 Toolbar 宽度为 60px
            opacity: isCanvasSelected ? 1 : 0,
            transition: isCanvasSelected
              ? 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease-out' // 显示动画
              : 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-in' // 隐藏动画
          }}
        >
          {isCanvasSelected && (
            <Toolbar
              onShapeSelect={(type) => setSelectedShapeType(type)}
              selectedShapeType={selectedShapeType}
              onDelete={handleDelete}
              hasSelectedShape={!!selectedId}
            />
          )}
        </div>
        <CanvasArea
          shapes={shapes}
          setShapes={setShapes}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedShapeType={selectedShapeType}
          setSelectedShapeType={setSelectedShapeType}
          stageHeight={stageHeight}
          setStageHeight={setStageHeight}
          onCanvasClick={handleCanvasClick}
        />
      </div>
    </NodeViewWrapper>
  );
};

export default CanvasComponent;