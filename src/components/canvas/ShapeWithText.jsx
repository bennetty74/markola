import React, { useRef, useEffect } from 'react';
import { Rect, Circle, Star, RegularPolygon, Ellipse, Text, Path } from 'react-konva';

const ShapeWithText = ({ shape, commonProps, isSelected, onStartEditing }) => {
  const textRef = useRef(null);
  const shapeRef = useRef(null);

  useEffect(() => {
    if (textRef.current && shapeRef.current && shape.text) {
      const textNode = textRef.current;
      const shapeNode = shapeRef.current;

      const textWidth = textNode.width();
      const textHeight = textNode.height();
      const shapeBounds = shapeNode.getClientRect();
      const shapeWidth = shapeBounds.width;
      const shapeHeight = shapeBounds.height;
      const shapeX = shapeBounds.x;
      const shapeY = shapeBounds.y;

      const textX = shapeX + shapeWidth / 2 - textWidth / 2;
      const textY = shapeY + shapeHeight / 2 - textHeight / 2;

      textNode.x(textX);
      textNode.y(textY);
      textNode.getLayer()?.batchDraw();
    }
  }, [shape.x, shape.y, shape.width, shape.height, shape.text, shape.fontSize, shape.type]);

  const renderShapeComponent = () => {
    switch (shape.type) {
      case 'rect':
        return <Rect ref={shapeRef} {...shape} {...commonProps} />;
      case 'circle':
        return <Circle ref={shapeRef} {...shape} radius={shape.width / 2} {...commonProps} />;
      case 'star':
        return (
          <Star
            ref={shapeRef}
            {...shape}
            numPoints={5}
            innerRadius={30}
            outerRadius={50}
            {...commonProps}
          />
        );
      case 'triangle':
        return (
          <RegularPolygon
            ref={shapeRef}
            {...shape}
            sides={3}
            radius={shape.width / 2}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderShapeComponent()}
      {shape.text && (
        <Text
          ref={textRef}
          text={shape.text}
          fontSize={shape.fontSize}
          fill={shape.textFill || '#000000'}
          fontStyle={shape.fontStyle || 'normal'}
          textDecoration={shape.textDecoration || 'none'}
          align="center"
          verticalAlign="middle"
          onDblClick={() => onStartEditing(shape.id, shape.text)}
        />
      )}
    </>
  );
};

export default ShapeWithText;