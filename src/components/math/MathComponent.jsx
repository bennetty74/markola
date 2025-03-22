import React, { useState, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import katex from 'katex';

const MathComponent = ({ node, updateAttributes, selected }) => {
  const [isEditing, setIsEditing] = useState(!node.attrs.latex);
  const [latex, setLatex] = useState(node.attrs.latex || '');
  const isInline = node.type.name === 'mathInline'; // 判断是否行内

  useEffect(() => {
    setLatex(node.attrs.latex || '');
  }, [node.attrs.latex]);

  const renderLatex = () => {
    try {
      const content = latex || '\\placeholder';
      return {
        __html: katex.renderToString(content, {
          displayMode: !isInline, // 行内为 false，块级为 true
          throwOnError: false,
        }),
      };
    } catch (error) {
      console.error('LaTeX 渲染错误:', error);
      return { __html: `<span style="color: red;">Invalid LaTeX: ${latex}</span>` };
    }
  };

  const handleBlur = () => {
    console.log('保存 LaTeX:', latex);
    updateAttributes({ latex });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  return (
    <NodeViewWrapper
      className={`math-node ${isInline ? 'inline' : 'block'} ${selected ? 'math-selected' : ''}`}
      data-type={node.type.name}
      as={isInline ? 'span' : 'div'}
    >
      {isEditing ? (
        <textarea
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          placeholder="输入 LaTeX 公式"
        />
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={renderLatex()}
          className={`cursor-pointer p-2 rounded ${isInline ? 'inline-block' : 'block'} bg-gray-100 dark:bg-gray-800`}
        />
      )}
    </NodeViewWrapper>
  );
};

export default MathComponent;