import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import NotebookSidebar from "./components/NotebookSidebar";
import MarkdownEditor from "./components/MarkdownEditor";
import WindowControls from "./components/WindowControls";
import WelcomeScreen from "./components/WelcomeScreen";
import debounce from "lodash/debounce";
import { loadSlim } from "tsparticles-slim";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"; 
import "./index.css";
import Lottie from "react-lottie";
import animationData from "./assets/cat.json"; 

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tree, setTree] = useState([]);
  const [theme, setTheme] = useState("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 默认收起

  // 配置 Lottie 动画
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const saveTreeDebounced = debounce((treeData) => {
    if (window.electronAPI) {
      window.electronAPI.saveTree(treeData);
    }
  }, 5000);

  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI) {
        const loadedTree = await window.electronAPI.loadTree();
        setTree(loadedTree);
      } else {
        console.error("electronAPI is not available");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (tree.length > 0 && window.electronAPI) {
      saveTreeDebounced(tree);
    }
  }, [tree]);

  const handleFileSelect = (file) => {
    console.log("selected file", file);
    setSelectedFile(file);
  };

  const handleContentChange = (content) => {
    if (selectedFile) {
      const updateTree = (items) =>
        items.map((item) => {
          if (item.id === selectedFile.id && item.type === "file") {
            return { ...item, content };
          }
          if (item.type === "folder") {
            return { ...item, children: updateTree(item.children) };
          }
          return item;
        });

      const newTree = updateTree(tree);
      setTree(newTree);
      setSelectedFile({ ...selectedFile, content });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("clicked")
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: theme === "dark" ? "#ffffff" : "#000000" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "bounce",
      },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 150, duration: 0.6 },
        push: { quantity: 4 },
      },
    },
    retina_detect: true,
  };

  const minimizeWindow = () => window.electronAPI?.minimizeWindow();
  const maximizeWindow = () => window.electronAPI?.maximizeWindow();
  const closeWindow = () => window.electronAPI?.closeWindow();

  return (
    <div
      className={`flex flex-col h-screen bg-gray-200 dark:bg-gray-900 dark:text-white`}
    >
      {/* 顶部栏保持不变 */}
      <div
        className={`flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 select-none`}
        style={{ WebkitAppRegion: "drag" }}
      >
        <div className="flex items-center">
          <span className="text-lg font-semibold">Markola</span>
        </div>
        {selectedFile && (
          <div className="w-auto h-6 flex items-center justify-center">
            <Lottie
              options={lottieOptions}
              height={30}
              width={80}
              isClickToPauseDisabled={true}
            />
          </div>
        )}
        <WindowControls
          minimizeWindow={minimizeWindow}
          maximizeWindow={maximizeWindow}
          closeWindow={closeWindow}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 侧边栏 */}
        <div
          className={`${
            isSidebarOpen ? "w-1/5 border-r border-gray-300" : "w-0"
          } h-full bg-gray-200 dark:bg-gray-900 dark:text-white overflow-y-auto scrollbar-hide transition-all duration-300`}
        >
          {isSidebarOpen && (
            <NotebookSidebar
              theme={theme}
              toggleTheme={toggleTheme}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              tree={tree}
              setTree={setTree}
            />
          )}
        </div>

        {/* 独立的展开/收起按钮 */}
        <div className="absolute bottom-2 left-2 z-50">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors bg-gray-200 dark:bg-gray-900"
            title={isSidebarOpen ? "收起侧边栏" : "展开侧边栏"}
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* 主内容区域 */}
        <div
          className={`${
            isSidebarOpen ? "w-4/5" : "w-full"
          } h-full overflow-y-auto shadow-lg scrollbar-hide relative transition-all duration-300`}
        >
          {selectedFile ? (
            <MarkdownEditor
              onContentChange={handleContentChange}
              initialContent={selectedFile?.content}
              theme={theme}
              setSelectedFile={setSelectedFile}
            />
          ) : (
            <WelcomeScreen
              theme={theme}
              particlesInit={particlesInit}
              particlesOptions={particlesOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
let root;

if (!container._reactRootContainer) {
  root = createRoot(container);
  container._reactRootContainer = root;
} else {
  root = container._reactRootContainer;
}

root.render(<App />);

export default App;