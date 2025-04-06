import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Transformer,
  Line,
  Arrow
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
  const resizeBarRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setStageWidth(width);
      }
    };
    requestAnimationFrame(updateWidth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const newHeight = Math.max(400, startHeight + deltaY);
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
  }, [stageHeight]);

  const handleMouseDown = (e) => {
    if (!['line', 'arrow'].includes(selectedShapeType)) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setIsDrawing(true);
    
    const newShape = {
      id: Date.now().toString(),
      type: selectedShapeType,
      stroke: '#000000',
      strokeWidth: 2,
      draggable: true,
    };

    if (selectedShapeType === 'line') {
      newShape.points = [pos.x, pos.y];
    } else if (selectedShapeType === 'arrow') {
      newShape.x = pos.x;
      newShape.y = pos.y;
      newShape.points = [0, 0, 0, 0];
      newShape.pointerLength = 10;
      newShape.pointerWidth = 10;
    }

    setCurrentShape(newShape);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !currentShape) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    if (currentShape.type === 'line') {
      setCurrentShape((prev) => ({
        ...prev,
        points: [...prev.points, pos.x, pos.y],
      }));
    } else if (currentShape.type === 'arrow') {
      setCurrentShape((prev) => ({
        ...prev,
        points: [0, 0, pos.x - prev.x, pos.y - prev.y],
      }));
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !currentShape) return;
    setIsDrawing(false);
  
    if (currentShape.type === 'arrow') {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const finalShape = {
        ...currentShape,
        points: [currentShape.x, currentShape.y, pos.x, pos.y],
        x: 0,
        y: 0,
      };
      setShapes((prev) => [...prev, finalShape]);
      setSelectedId(finalShape.id);
    } else if (currentShape.type === 'line') {
      const finalShape = { ...currentShape };
      setShapes((prev) => [...prev, finalShape]);
      setSelectedId(finalShape.id);
    }
  
    setCurrentShape(null);
    setSelectedShapeType(null);
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
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    console.log("x=",pointerPos.x, "y=",pointerPos.y)
    setLastClickPos({ x: pointerPos.x, y: pointerPos.y });

    if (!selectedShapeType || ['line', 'arrow'].includes(selectedShapeType)) {
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
    if (clickedOnEmpty && !['line', 'arrow'].includes(selectedShapeType)) {
      setSelectedId(null);
      setEditingShapeId(null);
    }
  };

  const updateShape = (updatedShape) => {
    const updatedShapes = shapes.map(
      (s) => (s.id === updatedShape.id ? { ...s, ...updatedShape } : s)
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
      setEditingShapeId(null);
    }
  };

  const getInputPosition = () => {
    if (!stageRef.current) return { left: 0, top: 0 };
    
    const stagePos = stageRef.current.getPointerPosition();
    console.log("stagePos", stagePos)
    
    // 直接使用最后一次点击的位置
    return {
      left: stagePos.x,
      top: stagePos.y
    };
  };

  const moveUp = (id) => {
    const index = shapes.findIndex((s) => s.id === id);
    if (index < shapes.length - 1) {
      const newShapes = [...shapes];
      [newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]];
      setShapes(newShapes);
    }
  };

  const moveDown = (id) => {
    const index = shapes.findIndex((s) => s.id === id);
    if (index > 0) {
      const newShapes = [...shapes];
      [newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]];
      setShapes(newShapes);
    }
  };

  useEffect(() => {
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
    const commonProps = {
      id: shape.id,
      onClick: (e) => {
        e.cancelBubble = true;
        setSelectedId(shape.id);
      },
      onDragEnd: (e) => {
        const node = e.target;
        if (shape.type === 'line' || shape.type === 'arrow') {
          // 计算拖动后的新位置
          const dx = node.x();
          const dy = node.y();
          // 更新 points，保持相对位置
          const newPoints = shape.points.map((p, i) =>
            i % 2 === 0 ? p + dx : p + dy
          );
          updateShape({
            ...shape,
            points: newPoints,
            x: 0, // 重置 x 和 y，因为位置已通过 points 表示
            y: 0,
          });
          // 重置节点位置
          node.x(0);
          node.y(0);
        } else {
          updateShape({
            ...shape,
            x: node.x(),
            y: node.y(),
          });
        }
      },
      onTransformEnd: (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        if (shape.type === 'line' || shape.type === 'arrow') {
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
      draggable: true, // 确保已设置
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
            isEditing={editingShapeId === shape.id}
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
            x={shape.x || 0}
            y={shape.y || 0}
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

  // 计算工具栏位置
  const getToolbarPosition = () => {
    if (!selectedShape) return { x: 0, y: 0 };
    if (selectedShape.type === 'line') {
      // 对于线，使用起点的坐标
      const startX = selectedShape.points[0];
      const startY = selectedShape.points[1];
      return { x: startX, y: startY };
    } else if (selectedShape.type === 'arrow') {
      // 对于箭头，使用起点坐标（points 已转换为绝对坐标）
      const startX = selectedShape.points[0];
      const startY = selectedShape.points[1];
      return { x: startX, y: startY };
    } else {
      // 其他形状使用 x 和 y
      return { x: selectedShape.x || 0, y: selectedShape.y || 0 };
    }
  };

  const toolbarPosition = getToolbarPosition();

  return (
    <div ref={containerRef} className="flex-1 relative">
      <div className="rounded">
        <Stage
          width={stageWidth}
          height={stageHeight}
          onMouseDown={(e) => {
            if (['line', 'arrow'].includes(selectedShapeType)) {
              handleMouseDown(e);
            } else {
              checkDeselect(e);
              handleStageClick(e);
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
            {currentShape && (
              currentShape.type === 'line' ? (
                <Line {...currentShape} />
              ) : (
                <Arrow
                  x={currentShape.x}
                  y={currentShape.y}
                  points={currentShape.points}
                  stroke={currentShape.stroke}
                  strokeWidth={currentShape.strokeWidth}
                  pointerLength={currentShape.pointerLength}
                  pointerWidth={currentShape.pointerWidth}
                />
              )
            )}
          </Layer>
        </Stage>
        <div className="w-full flex justify-center items-center opacity-50">
          <div
            ref={resizeBarRef}
            className="w-20 h-2 bg-gray-600 cursor-ns-resize rounded-full hover:bg-gray-400"
            style={{ marginTop: "4px" }}
          />
        </div>
      </div>
      {editingShapeId && (() => {
        
        const shape = shapes.find((s) => s.id === editingShapeId);
        if (!shape) return null;
        const { left, top } = getInputPosition();
        return (
          <div 
            className="absolute p-2 shadow-lg rounded-md bg-white border-2 border-gray-300"
            style={{ left: `${left}px`, top: `${top}px`, width: "300px" }}
          >
            <div className="p-2 text-sm text-gray-600">
              <span>请输入内容 (Shift+Enter换行, Enter确定)</span>
            </div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={saveText}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  // 允许Shift+Enter换行
                  return;
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveText();
                }
              }}
              autoFocus
              placeholder="在此输入文字..."
              className="w-full p-3 text-black resize-none outline-none"
              style={{ minHeight: "80px" }}
              ref={(textArea) => {
                if (textArea) {
                  textArea.focus();
                  // 只有在初始编辑时才将光标放在文本末尾，否则保持当前光标位置
                  if (editText === shape.text || editText === "") {
                    textArea.selectionStart = textArea.selectionEnd = editText.length;
                  }
                }
              }}
            />
            <div className="flex justify-end">
              <button 
                onClick={saveText}
                className="px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        );
      })()}
      {selectedShape && (
        <ShapeToolbar
          shape={selectedShape}
          updateShape={updateShape}
          position={toolbarPosition}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
        />
      )}
    </div>
  );
};

export default CanvasArea;