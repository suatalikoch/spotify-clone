/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

declare global {
    interface Window {
      darkMode: {
        toggle: () => Promise<boolean>;  // `toggle` returns a Promise resolving to a boolean
        system: () => Promise<void>;     // `system` is an async method with no return value
      };
    }
  }

const toggleDarkModeButton = document.getElementById('toggle-dark-mode') as HTMLButtonElement;
const resetToSystemButton = document.getElementById('reset-to-system') as HTMLButtonElement;
const themeSourceElement = document.getElementById('theme-source') as HTMLElement;

// Event listener for toggling dark mode
toggleDarkModeButton.addEventListener('click', async () => {
  const isDarkMode: boolean = await window.darkMode.toggle();
  themeSourceElement.innerHTML = isDarkMode ? 'Dark' : 'Light';
});

// Event listener for resetting to system theme
resetToSystemButton.addEventListener('click', async () => {
  await window.darkMode.system();
  themeSourceElement.innerHTML = 'System';
});