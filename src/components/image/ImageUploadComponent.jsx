import React, { useEffect, useRef} from "react";
import { NodeViewWrapper } from "@tiptap/react";

const ImageUploadComponent = ({ node, updateAttributes }) => {
  const { src, isPlaceholder } = node.attrs;
  const inputRef = useRef(null); // 用于管理 input 元素


  const handleClick = () => {
    if (isPlaceholder) {
      // 创建并缓存 input 元素
      if (!inputRef.current) {
        inputRef.current = document.createElement("input");
        inputRef.current.type = "file";
        inputRef.current.accept = "image/*";
        inputRef.current.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            if (file.type.startsWith("image/")) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target.result;
                updateAttributes({
                  src: base64,
                  isPlaceholder: false,
                });
                console.log("Image uploaded as Base64:", base64.substring(0, 50) + "..."); // 调试用
              };
              reader.onerror = () => {
                console.error("Failed to read image file");
              };
              reader.readAsDataURL(file);
            } else {
              console.error("Selected file is not an image");
            }
          }
          // 重置 input 以便下次使用
          inputRef.current.value = "";
        };
      }
      inputRef.current.click();
    }
  };

  console.log("ImageUploadComponent attrs:", { src, isPlaceholder }); // 调试用

  return (
    <NodeViewWrapper>
      {isPlaceholder ? (
        <div
          className="border-2 border-dashed border-gray-400 p-4 text-center cursor-pointer bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
          onClick={handleClick}
        >
          <p>Click to upload an image</p>
        </div>
      ) : (
        <img
          src={src}
          alt="Uploaded"
          className="max-w-full h-auto"
          onError={(e) => console.error("Image failed to load:", src.substring(0, 50) + "...")} // 调试用
        />
      )}
    </NodeViewWrapper>
  );
};

export default ImageUploadComponent;