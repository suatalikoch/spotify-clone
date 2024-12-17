export interface IElectronAPI {
  minimizeWindow: () => void;
  restoreWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  isMaximized: () => boolean;
}

export interface IDarkModeAPI {
  toggle: () => Promise<boolean>;
  system: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    darkModeAPI: IDarkModeAPI;
    fileAPI: IFileAPI;
  }
}
