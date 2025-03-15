import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MathComponent from './MathComponent';

// 行内公式节点
const MathInline = Node.create({
  name: 'mathInline',
  group: 'inline', // 仅行内
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-latex'),
        renderHTML: (attributes) => ({
          'data-type': 'mathInline',
          'data-latex': attributes.latex,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="mathInline"]', 
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-type': 'mathInline' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent);
  },

  addCommands() {
    return {
      insertMathInline: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: 'mathInline',
          attrs: attributes || { latex: '' },
        });
      },
    };
  },

  addInputRules() {
    return [
      {
        find: /\$([^$]+)\$/,
        handler: ({ state, range, match }) => {
          const fullMatch = match[0];
          const latex = match[1].trim();
          const { tr } = state;
          const start = range.from - (fullMatch.length - (range.to - range.from));
          tr.replaceWith(start, range.to, this.type.create({ latex }));
          return tr;
        },
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-m': () => {
        const { state, dispatch } = this.editor;
        const { from, to } = state.selection;
        const selectedText = state.doc.textBetween(from, to, ' ');
        if (selectedText) {
          dispatch(
            state.tr.replaceWith(from, to, this.type.create({ latex: selectedText }))
          );
          return true;
        }
        return false;
      },
    };
  },
});

// 块级公式节点
const MathBlock = Node.create({
  name: 'mathBlock',
  group: 'block', // 仅块级
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-latex'),
        renderHTML: (attributes) => ({
          'data-type': 'mathBlock',
          'data-latex': attributes.latex,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="mathBlock"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'mathBlock' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent);
  },

  addCommands() {
    return {
      insertMathBlock: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: 'mathBlock',
          attrs: attributes || { latex: '' },
        });
      },
    };
  },

  addInputRules() {
    return [
      {
        find: /\\\[([\s\S]*?)\\\]/,
        handler: ({ state, range, match }) => {
          const fullMatch = match[0];
          const latex = match[1].trim();
          const { tr } = state;
          const start = range.from - (fullMatch.length - (range.to - range.from));
          tr.replaceWith(start, range.to, this.type.create({ latex }));
          return tr;
        },
      },
    ];
  },
});

export { MathInline, MathBlock };