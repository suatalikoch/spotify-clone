// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

// Define the structure of the `darkMode` API for type safety
interface DarkModeAPI {
    toggle: () => Promise<boolean>;
    system: () => Promise<void>;
  }
  
  // Expose the `darkMode` API to the renderer process using `contextBridge`
  contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
  } as DarkModeAPI);