/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // 使用 class 切换 dark 模式
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#faf8f4', // 从 #f5f1eb 提亮，极浅暖米灰，几乎是纯白
          200: '#f0ede6', // 从 #e8e3db 提亮，超浅暖灰
          300: '#e4ded5', // 从 #d8d1c7 提亮，浅暖灰
          400: '#c9c2b6', // 从 #b8afa2 提亮，中浅暖灰
          500: '#aea498', // 从 #998f80 提亮，中度暖灰
          600: '#90867a', // 从 #7a7061 提亮，稍深暖灰
          700: '#70675d', // 从 #5c5348 提亮，深暖灰
          800: '#504b43', // 从 #403a32 提亮，很深暖灰
          900: '#3a3530', // 从 #2c2721 提亮，极深暖灰
        },
      },
      keyframes: {
        'popup-fade-in': {
          'from': { opacity: 0, transform: 'translateY(-10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'popup-fade-in': 'popup-fade-in 0.2s ease-out'
      }
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
