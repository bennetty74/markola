import React, { useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';

const TextComponent = ({
  shape,
  isSelected,
  isEditing, // 从父组件接收编辑状态
  onSelect,
  onChange,
  onDragEnd,
  onStartEditing,
}) => {
  const textRef = useRef(null);
  const transformerRef = useRef(null);

  // 同步 Transformer 与文字节点
  useEffect(() => {
    if (isSelected && !isEditing && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, isEditing]);


  return (
    <>
      <Text
        ref={textRef}
        {...shape}
        onClick={onSelect}
        onDblClick={() => {
          onStartEditing(shape.id, shape.text); // 直接调用父组件的编辑函数
        }}
        onDragEnd={onDragEnd}
        onTransformEnd={(e) => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(10, shape.fontSize * scaleX),
          });
        }}
        stroke={shape.stroke || (isSelected ? 'black' : null)}
        strokeWidth={shape.strokeWidth || 2}
        draggable={!isEditing} // 使用父组件传递的 isEditing
      />
      {isSelected && !isEditing && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TextComponent;