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

import '.././css/global.css';
import '.././css/header.css';
import '.././css/primary-bar.css';
import '.././css/secondary-bar.css';
import '.././css/footer.css';

import '.././css/browse-page.css';
import '.././css/playlist-page.css';
import '.././css/404.css';

const minimizeButton = document.getElementById('minimize-button') as HTMLButtonElement;
const maximizeButton = document.getElementById('maximize-button') as HTMLButtonElement;
const closeButton = document.getElementById('close-button') as HTMLButtonElement;

const toggleDarkModeButton = document.getElementById('toggle-dark-mode') as HTMLButtonElement;
const resetToSystemButton = document.getElementById('reset-to-system') as HTMLButtonElement;
const themeSourceElement = document.getElementById('theme-source') as HTMLElement;

minimizeButton.addEventListener('click', async (): Promise<void> => {
  window.electronAPI.minimizeWindow();
});

maximizeButton.addEventListener('click', async (): Promise<void> => {
  if (window.electronAPI.isMaximized) {
    window.electronAPI.restoreWindow();
  } else {
    window.electronAPI.maximizeWindow();
  }
});

closeButton.addEventListener('click', async (): Promise<void> => {
  window.electronAPI.closeWindow();
});

// Event listener for toggling dark mode
toggleDarkModeButton.addEventListener('click', async (): Promise<void> => {
  const isDarkMode: boolean = await window.darkModeAPI.toggle();
  themeSourceElement.innerHTML = isDarkMode ? 'Dark' : 'Light';
});

// Event listener for resetting to system theme
resetToSystemButton.addEventListener('click', async (): Promise<void> => {
  await window.darkModeAPI.system();
  themeSourceElement.innerHTML = 'System';
});

document.addEventListener('DOMContentLoaded', () => {
  function loadPage(page: string): void {
    const contentArea = document.getElementById('page') as HTMLDivElement;

    const pageMapping: Record<string, string> = {
      home: 'http://localhost:5500/spotify/src/html/home.html',
      browse: 'http://localhost:5500/spotify/src/html/browse.html',
      playlist: 'http://localhost:5500/spotify/src/html/playlist.html',
      settings: 'http://localhost:5500/spotify/src/html/settings.html'
    }

    const pageFile = pageMapping[page] || 'http://localhost:5500/spotify/src/html/404.html'; // Default to a 404 page

    fetch(pageFile)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Page not found!')
        }

        return response.text();
      })
      .then((htmlContent) => {
        if (contentArea) {
          contentArea.innerHTML = htmlContent;
        }
      })
      .catch((error) => {
        if (contentArea) {
          contentArea.innerHTML = '<h2>Page Not Found</h2>';
        }

        console.error(error);
    });
  }

  document.getElementById('header-center').addEventListener('click', (e) => {
    const target = e.target as HTMLDivElement;
    
    if (target && target.matches('button')) {
      loadPage(target.getAttribute('data-page'));
    }
  });

  loadPage('playlist'); // Load the home page initially
});
