const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadTree: () => ipcRenderer.invoke('load-tree'),
  saveTree: (tree) => ipcRenderer.invoke('save-tree', tree),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  savePDF: (pdfData, fileName) => ipcRenderer.invoke("save-pdf", { pdfData, fileName }),
  exportToHTML: (content, fileName) => ipcRenderer.invoke("export-to-html", { content, fileName }),
  getCollaborators: () => ipcRenderer.invoke("get-collaborators"),
  saveCollaborators: (colls) => ipcRenderer.invoke("save-collaborators", colls),
});