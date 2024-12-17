// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI, IDarkModeAPI } from "./interface";

// Exposing the `electronAPI` to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: (): void => ipcRenderer.send("minimize-window"),
  maximizeWindow: (): void => ipcRenderer.send("maximize-window"),
  closeWindow: (): void => ipcRenderer.send("close-window"),
} as IElectronAPI);

// Expose the `darkModeAPI` to the renderer process using `contextBridge`
contextBridge.exposeInMainWorld("darkModeAPI", {
  toggle: (): Promise<boolean> => ipcRenderer.invoke("dark-mode:toggle"),
  system: (): Promise<void> => ipcRenderer.invoke("dark-mode:system"),
} as IDarkModeAPI);
