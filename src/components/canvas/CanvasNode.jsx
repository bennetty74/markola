import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CanvasComponent from "./CanvasComponent";

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
          return shapes ? JSON.parse(shapes) : [];
        },
        renderHTML: (attributes) => {
          return { shapes: JSON.stringify(attributes.shapes || []) };
        },
      },
      height: { // 新增：存储画布高度
        default: 400, // 默认高度 400
        parseHTML: (element) => {
          const height = element.getAttribute("height");
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