const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { readFile, writeFile } = require("fs/promises");
const path = require("path");
const { fileURLToPath } = require("url");
const fs = require("fs");

const dataPath = path.join(app.getPath("userData"), "notebook.json");
console.log(dataPath)
// 协作用户文件路径
const collaboratorsFile = path.join(app.getPath("userData"), "collaborators.json");
console.log("collaboratorsFile",collaboratorsFile)


const preloadPath = path.join(__dirname, "preload.js");
if (!fs.existsSync(preloadPath)) {
  console.error('Preload file does not exist!')
} else {
  console.log("--------exist preload.js--------")
}

let win = null;
let width = 1100;
let height = 800;

function createWindow() {
  win = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  if (process.env.NODE_ENV === "dev") {
    console.log("path========",__dirname, preloadPath);
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools(); 
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// [改动 8] IPC 处理数据存储
ipcMain.handle("load-tree", async () => {
  try {
    const data = await readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log("error", error)
    return [];
  }
});

ipcMain.handle("save-tree", async (event, tree) => {
  await writeFile(dataPath, JSON.stringify(tree, null, 2), "utf8");
});

ipcMain.on('minimize-window', () => {
  win.minimize();
});

ipcMain.on('maximize-window', () => {
  if (!win) return;

  const isMaximized = win.isMaximized();
  console.log("max ? ", isMaximized);

  if (isMaximized) {
    // 手动设置窗口大小和位置
    win.setSize(width, height); // 设置为你想要的默认大小
    win.center(); // 将窗口居中
  } else {
    win.maximize();
  }
});

ipcMain.on('close-window', () => {
  win.close();
  app.quit();
});

ipcMain.handle("save-pdf", async (event, { pdfData, fileName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: `${fileName}.pdf`,
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  });

  if (!canceled && filePath) {
    try {
      // 将 ArrayBuffer 写入文件
      await writeFile(filePath, Buffer.from(pdfData));
      return true;
    } catch (error) {
      console.error("Error saving PDF:", error);
      return false;
    }
  }
  return false;
});

ipcMain.handle("export-to-html", async (event, { content, fileName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: `${fileName}.html`,
    filters: [{ name: "HTML Files", extensions: ["html"] }],
  });

  if (!canceled && filePath) {
    try {
      // 读取项目 CSS 文件
      const cssPath = path.join(__dirname, "../src/index.css"); // 调整路径到你的 CSS 文件
      let projectCSS;
      try {
        projectCSS = await readFile(cssPath, "utf8");
      } catch (cssError) {
        console.warn("Failed to load project CSS, using fallback:", cssError);
        projectCSS = ""; // 如果 CSS 文件不存在，使用空字符串
      }

      // 构造完整的 HTML 文件内容，嵌入项目 CSS
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${fileName}</title>
            <style>
              ${projectCSS}
              /* 额外的 HTML 文件样式 */
              body { padding: 20px; margin: 0; font-family: Arial, sans-serif; }
              .tiptap { max-width: 100%; }
            </style>
          </head>
          <body class="tiptap">${content}</body>
        </html>
      `;

      // 保存 HTML 文件
      await writeFile(filePath, htmlContent, "utf8");
      return true;
    } catch (error) {
      console.error("Error exporting to HTML:", error);
      return false;
    }
  }
  return false;
});

// 初始化默认用户列表
async function loadCollaborators() {
  try {
    if (!fs.existsSync(collaboratorsFile)) {
      await writeFile(collaboratorsFile, JSON.stringify([]), "utf8");
      return [];
    }
    const data = await readFile(collaboratorsFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("loadCollaborators error:", error);
    return [];
  }
}

// 获取协作用户列表
ipcMain.handle("get-collaborators", async () => {
  return await loadCollaborators();
});

// 添加协作用户
ipcMain.handle("save-collaborators", async (event, colls) => {
    await writeFile(collaboratorsFile, JSON.stringify(colls, null, 2), "utf8");
});

