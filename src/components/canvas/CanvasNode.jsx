import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CanvasComponent from "./CanvasComponent";

// CanvasNode.jsx
export const CanvasNode = Node.create({
  name: "canvasNode",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      shapes: {
        default: [],
        parseHTML: (element) => {
          const shapes = element.getAttribute("shapes");
          console.log('Parsing shapes:', shapes); // 调试：检查解析的 shapes
          return shapes ? JSON.parse(shapes) : [];
        },
        renderHTML: (attributes) => {
          console.log('Rendering shapes:', attributes.shapes); // 调试：检查渲染的 shapes
          return { shapes: JSON.stringify(attributes.shapes || []) };
        },
      },
      height: {
        default: 400,
        parseHTML: (element) => {
          const height = element.getAttribute("height");
          console.log('Parsing height:', height); // 调试：检查解析的 height
          return height ? parseInt(height, 10) : 400;
        },
        renderHTML: (attributes) => {
          return { height: attributes.height || 400 };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "canvas-node" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["canvas-node", HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CanvasComponent);
  },
});

export default CanvasNode;