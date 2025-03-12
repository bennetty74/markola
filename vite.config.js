import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        require("tailwindcss"), // 使用 tailwindcss v3
        require("autoprefixer"),
      ],
    },
  },
  server: {
    port: 5173, // 固定端口
  },
  base: "./",
  root: ".", // 指定根目录为项目根目录
  publicDir: "public", // 如果有静态资源，放在 public 文件夹（可选）
});
