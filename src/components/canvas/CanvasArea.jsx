import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Transformer,
  Line, Arrow
} from "react-konva";
import TextComponent from "./TextComponent";
import ShapeToolbar from "./ShapeToolbar";
import ShapeWithText from './ShapeWithText';

const CanvasArea = ({
  shapes,
  setShapes,
  selectedId,
  setSelectedId,
  selectedShapeType,
  setSelectedShapeType,
  stageHeight, 
  setStageHeight, 
  onCanvasClick,
}) => {
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const transformerRef = useRef(null);
  const [editingShapeId, setEditingShapeId] = useState(null);
  const [editText, setEditText] = useState("");
  const [lastClickPos, setLastClickPos] = useState({ x: 0, y: 0 });
  const [stageWidth, setStageWidth] = useState(0);
  const resizeBarRef = useRef(null); // 新增：调整条的 ref

  const [isDrawing, setIsDrawing] = useState(false); // 新增：绘制状态
  const [currentLine, setCurrentLine] = useState(null); // 新增：当前线条

  // 动态获取父元素宽度
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        console.log("Initial width:", width); // 调试日志
        setStageWidth(width);
      } else {
        console.log("containerRef.current is null"); // 调试 ref 是否绑定
      }
    };

    // 在下一帧获取宽度，确保 DOM 已渲染
    requestAnimationFrame(updateWidth);

    // 可选：如果仍不准确，可以添加短暂延迟
    // setTimeout(updateWidth, 0);
  }, []);

  // 监听窗口大小变化以更新宽度
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        console.log("Resize width:", width); // 调试日志
        setStageWidth(width);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // 初始调用，确保首次加载时更新
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 拖拽调整高度的逻辑
  useEffect(() => {
    const resizeBar = resizeBarRef.current;
    let startY = 0;
    let startHeight = stageHeight;

    const handleMouseDown = (e) => {
      startY = e.clientY;
      startHeight = stageHeight;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(100, startHeight + deltaY); // 最小高度 100
      setStageHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    if (resizeBar) {
      resizeBar.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (resizeBar) {
        resizeBar.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [stageHeight]); // 依赖 stageHeight，确保更新时重新绑定



  const handleMouseDown = (e) => {
    if (selectedShapeType !== 'line') return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setIsDrawing(true);
    setCurrentLine({
      id: Date.now().toString(),
      type: 'line',
      points: [pos.x, pos.y], // 初始化起点
      stroke: '#000000',
      strokeWidth: 2,
      draggable: true,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || selectedShapeType !== 'line' || !currentLine) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setCurrentLine((prev) => ({
      ...prev,
      points: [...prev.points, pos.x, pos.y], // 追加鼠标位置
    }));
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || selectedShapeType !== 'line' || !currentLine) return;
    setIsDrawing(false);
    setShapes((prev) => [...prev, currentLine]);
    setCurrentLine(null);
    setSelectedShapeType(null); // 绘制完成后重置工具
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleStageClick = (e) => {
    console.log("handleStageClick - e:", e);
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    setLastClickPos({ x: pointerPos.x, y: pointerPos.y });
  
    if (!selectedShapeType || selectedShapeType === 'line') {
      if (e.target === stage) {
        onCanvasClick();
      }
      return;
    }
  
    const newShape = {
      id: Date.now().toString(),
      type: selectedShapeType,
      x: pointerPos.x,
      y: pointerPos.y,
      draggable: true,
      text: "编辑文字",
      fontSize: 14,
      fill: getRandomColor(),
      textFill: "#000000",
    };
  
    if (selectedShapeType === "text") {
      newShape.text = "点击编辑文字";
      newShape.fontSize = 20;
      newShape.fill = getRandomColor();
    } else if (selectedShapeType === 'arrow') {
      newShape.points = [0, 0, 100, 0];
      newShape.pointerLength = 10;
      newShape.pointerWidth = 10;
    } else {
      newShape.width = 100;
      newShape.height = 100;
      newShape.fill = getRandomColor();
    }
  
    setShapes([...shapes, newShape]);
    setSelectedShapeType(null);
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty && selectedShapeType !== 'line') {
      setSelectedId(null);
      setEditingShapeId(null);
    }
  };

  const updateShape = (updatedShape) => {
    const updatedShapes = shapes.map(
      (s) => (s.id === updatedShape.id ? { ...s, ...updatedShape } : s) // 支持合并所有属性
    );
    setShapes(updatedShapes);
  };

  const startEditing = (shapeId, initialText) => {
    setEditingShapeId(shapeId);
    setEditText(initialText);
  };

  const saveText = () => {
    if (editingShapeId) {
      const updatedShape = shapes.find((s) => s.id === editingShapeId);
      if (updatedShape) {
        updateShape({ ...updatedShape, text: editText });
      }
      setEditingShapeId(null); // 重置编辑状态
    }
  };

  const getInputPosition = () => {
    if (!stageRef.current) return { left: 0, top: 0 };
    const stagePos = stageRef.current.container().getBoundingClientRect();
    return {
      left: stagePos.left + lastClickPos.x,
      top: stagePos.top + lastClickPos.y,
    };
  };

  // 上移层级
  const moveUp = (id) => {
    const index = shapes.findIndex((s) => s.id === id);
    if (index < shapes.length - 1) {
      const newShapes = [...shapes];
      [newShapes[index], newShapes[index + 1]] = [
        newShapes[index + 1],
        newShapes[index],
      ];
      setShapes(newShapes);
    }
  };

  // 下移层级
  const moveDown = (id) => {
    const index = shapes.findIndex((s) => s.id === id);
    if (index > 0) {
      const newShapes = [...shapes];
      [newShapes[index], newShapes[index - 1]] = [
        newShapes[index - 1],
        newShapes[index],
      ];
      setShapes(newShapes);
    }
  };

  React.useEffect(() => {
    if (selectedId && transformerRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const renderShape = (shape) => {
    const isSelected = selectedId === shape.id;
    const isEditing = editingShapeId === shape.id;
    const commonProps = {
      id: shape.id,
      onClick: () => setSelectedId(shape.id),
      onDragEnd: (e) => updateShape({ ...shape, x: e.target.x(), y: e.target.y() }),
      onTransformEnd: (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        if (shape.type === 'line') {
          updateShape({
            ...shape,
            points: shape.points.map((p, i) => (i % 2 === 0 ? p * scaleX : p * scaleY)),
          });
        } else {
          updateShape({
            ...shape,
            x: node.x(),
            y: node.y(),
            width: shape.type === 'circle' || shape.type === 'triangle' ? node.width() * scaleX : node.width() * scaleX,
            height: shape.type === 'circle' ? node.height() * scaleY : node.height() * scaleY,
          });
        }
      },
      stroke: isSelected ? shape.stroke || 'black' : shape.stroke,
      strokeWidth: shape.strokeWidth || 2,
    };
  
    switch (shape.type) {
      case 'rect':
      case 'circle':
      case 'star':
      case 'ring':
      case 'triangle':
      case 'sun':
        return (
          <ShapeWithText
            shape={shape}
            commonProps={commonProps}
            isSelected={isSelected}
            onStartEditing={startEditing}
          />
        );
      case 'text':
        return (
          <TextComponent
            shape={shape}
            isSelected={isSelected}
            isEditing={isEditing}
            onSelect={() => setSelectedId(shape.id)}
            onChange={updateShape}
            onDragEnd={(e) => updateShape({ ...shape, x: e.target.x(), y: e.target.y() })}
            onStartEditing={startEditing}
          />
        );
        case 'line':
      return (
        <Line
          {...commonProps}
          points={shape.points}
          stroke={shape.stroke || '#000000'}
          strokeWidth={shape.strokeWidth || 2}
        />
      );
    case 'arrow':
      return (
        <Arrow
          {...commonProps}
          x={shape.x}
          y={shape.y}
          points={shape.points}
          stroke={shape.stroke || '#000000'}
          strokeWidth={shape.strokeWidth || 2}
          pointerLength={shape.pointerLength || 10}
          pointerWidth={shape.pointerWidth || 10}
        />
      );
      default:
        return null;
    }
  };

  const selectedShape = shapes.find((s) => s.id === selectedId);

  return (
    <div ref={containerRef} className="flex-1 relative">
      <div className="rounded">
        <Stage
          width={stageWidth}
          height={stageHeight}
          onMouseDown={(e) => {
            if (selectedShapeType === 'line') {
              handleMouseDown(e); // 优先处理自由画线
            } else {
              checkDeselect(e); // 非 line 时检查取消选择
              handleStageClick(e); // 处理其他形状的点击
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={(e) => handleStageClick(e)}
          ref={stageRef}
          className="w-full"
        >
          <Layer>
            {shapes.map((shape) => (
              <React.Fragment key={shape.id}>
                {renderShape(shape)}
              </React.Fragment>
            ))}
            {selectedId && selectedShape?.type !== "text" && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 20 || newBox.height < 20) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
            {currentLine && <Line {...currentLine} />}
          </Layer>
        </Stage>
        {/* 新增：调整条 */}
        <div className="w-full flex justify-center items-center opacity-50">
          <div
            ref={resizeBarRef}
            className="w-20 h-2 bg-gray-300 cursor-ns-resize rounded-full hover:bg-gray-400"
            style={{ marginTop: "4px" }}
          />
        </div>
      </div>
      {editingShapeId &&
        (() => {
          const shape = shapes.find((s) => s.id === editingShapeId);
          if (!shape) return null;
          const { left, top } = getInputPosition();
          return (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={saveText}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveText();
              }}
              autoFocus
              className="absolute p-1 border border-gray-300 rounded text-black bg-white"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: "200px",
              }}
            />
          );
        })()}
      {selectedShape && (
        <ShapeToolbar
          shape={selectedShape}
          updateShape={updateShape}
          position={{ x: selectedShape.x, y: selectedShape.y }}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
        />
      )}
    </div>
  );
};

export default CanvasArea;
