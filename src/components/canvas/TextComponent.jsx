import React, { useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';

const TextComponent = ({
  shape,
  isSelected,
  isEditing,
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
        fill={shape.textFill || shape.fill || '#000000'}
        fontStyle={shape.fontStyle || 'normal'}
        onClick={onSelect}
        onDblClick={() => {
          onStartEditing(shape.id, shape.text);
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
        stroke={shape.stroke} 
        strokeWidth={isSelected ? 1 : shape.strokeWidth || 2}
        draggable={!isEditing}
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