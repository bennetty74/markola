import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import Toolbar from './Toolbar';
import CanvasArea from './CanvasArea';

// CanvasComponent.jsx
const CanvasComponent = ({ node, updateAttributes }) => {
  const [shapes, setShapes] = useState(node.attrs.shapes || []);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedShapeType, setSelectedShapeType] = useState(null);
  const [stageHeight, setStageHeight] = useState(node.attrs.height || 400);
  const [isCanvasSelected, setIsCanvasSelected] = useState(false);
  const wrapperRef = useRef(null);

  // 监听 node.attrs 的变化，保持状态同步
  useEffect(() => {
    setShapes(node.attrs.shapes || []);
    setStageHeight(node.attrs.height || 400);
  }, [node.attrs.shapes, node.attrs.height]);

  // 更新节点属性
  useEffect(() => {
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
      <div className={`my-4 bg-gray-100 rounded-lg ${isCanvasSelected ? 'border border-gray-300': ''} flex overflow-hidden`}>
        <div className="flex items-center justify-center">
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