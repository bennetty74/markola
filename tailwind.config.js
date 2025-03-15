/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // 使用 class 切换 dark 模式
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#f5f1eb', // 非常浅的暖米灰，接近象牙白
          200: '#e8e3db', // 浅暖灰，柔和优雅
          300: '#d8d1c7', // 中浅暖灰，温暖而低调
          400: '#b8afa2', // 中度暖灰，适合次要元素
          500: '#998f80', // 中深暖灰，沉稳大气
          600: '#7a7061', // 较深暖灰，高级感强
          700: '#5c5348', // 深暖灰，接近咖啡色调
          800: '#403a32', // 很深的暖灰，带棕色质感
          900: '#2c2721', // 极深暖灰，近似炭黑但有温度
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
