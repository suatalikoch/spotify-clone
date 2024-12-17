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

import ".././css/global.css";

import ".././css/authentication.css";

import ".././css/header.css";
import ".././css/primary-bar.css";
import ".././css/secondary-bar.css";
import ".././css/footer.css";

import ".././css/browse-page.css";
import ".././css/playlist-page.css";
import ".././css/404.css";

const minimizeButton = document.getElementById(
  "minimize-button"
) as HTMLButtonElement;
const maximizeButton = document.getElementById(
  "maximize-button"
) as HTMLButtonElement;
const closeButton = document.getElementById(
  "close-button"
) as HTMLButtonElement;

const toggleDarkModeButton = document.getElementById(
  "toggle-dark-mode"
) as HTMLButtonElement;
const resetToSystemButton = document.getElementById(
  "reset-to-system"
) as HTMLButtonElement;
const themeSourceElement = document.getElementById(
  "theme-source"
) as HTMLElement;

const primaryBarCollapseButton = document.getElementById(
  "primary-bar-collapse-button"
) as HTMLButtonElement;
const secondaryBarButton = document.getElementById(
  "now-playing-view-button"
) as HTMLButtonElement;
const secondaryBarButtonIcon = document.getElementById(
  "now-playing-view"
) as HTMLButtonElement;
const secondaryBarCloseButton = document.getElementById(
  "secondary-bar-close-button"
) as HTMLButtonElement;
const primaryBar = document.getElementById("primary-bar") as HTMLElement;
const secondaryBar = document.getElementById("secondary-bar") as HTMLElement;
const rightSplitter = document.getElementById("right-splitter") as HTMLElement;

minimizeButton.addEventListener("click", async (): Promise<void> => {
  window.electronAPI.minimizeWindow();
});

maximizeButton.addEventListener("click", async (): Promise<void> => {
  if (window.electronAPI.isMaximized) {
    window.electronAPI.restoreWindow();
  } else {
    window.electronAPI.maximizeWindow();
  }
});

closeButton.addEventListener("click", async (): Promise<void> => {
  window.electronAPI.closeWindow();
});

// Event listener for toggling dark mode
toggleDarkModeButton.addEventListener("click", async (): Promise<void> => {
  const isDarkMode: boolean = await window.darkModeAPI.toggle();
  themeSourceElement.innerHTML = isDarkMode ? "Dark" : "Light";
});

// Event listener for resetting to system theme
resetToSystemButton.addEventListener("click", async (): Promise<void> => {
  await window.darkModeAPI.system();
  themeSourceElement.innerHTML = "System";
});

primaryBarCollapseButton.addEventListener("click", async (): Promise<void> => {
  const primaryBarStyle = window.getComputedStyle(primaryBar);

  const elementsToBeCollapsed = document.getElementsByClassName("collapsable");

  if (parseInt(primaryBarStyle.width) > 100) {
    primaryBar.style.width = "100px";

    for (let i = 0; i < elementsToBeCollapsed.length; i++) {
      const element = elementsToBeCollapsed[i] as HTMLElement;
      element.style.display = "none";
    }
  } else if (parseInt(primaryBarStyle.width) <= 100) {
    primaryBar.style.width = "400px";

    for (let i = 0; i < elementsToBeCollapsed.length; i++) {
      const element = elementsToBeCollapsed[i] as HTMLElement;
      element.style.display = "block";
    }
  }
});

secondaryBarCloseButton.addEventListener("click", async (): Promise<void> => {
  secondaryBar.style.display = "none";
  rightSplitter.style.display = "none";
  secondaryBarButtonIcon.classList.remove("color-lime");
});

secondaryBarButton.addEventListener("click", async (): Promise<void> => {
  const secondaryBarStyle = window.getComputedStyle(secondaryBar);

  if (secondaryBarStyle.display == "none") {
    secondaryBar.style.display = "flex";
    secondaryBarButtonIcon.classList.add("color-lime");
    rightSplitter.style.display = "flex";
  } else if (secondaryBarStyle.display == "flex") {
    secondaryBar.style.display = "none";
    secondaryBarButtonIcon.classList.remove("color-lime");
    rightSplitter.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  function loadPage(page: string): void {
    const contentArea = document.getElementById("page") as HTMLDivElement;

    const pageMapping: Record<string, string> = {
      home: "http://localhost:5500/spotify/src/html/home.html",
      browse: "http://localhost:5500/spotify/src/html/browse.html",
      new: "http://localhost:5500/spotify/src/html/new.html",
      playlist: "http://localhost:5500/spotify/src/html/playlist.html",
      profile: "http://localhost:5500/spotify/src/html/profile.html",
      settings: "http://localhost:5500/spotify/src/html/settings.html",
    };

    const pageFile =
      pageMapping[page] || "http://localhost:5500/spotify/src/html/404.html"; // Default to a 404 page

    fetch(pageFile)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Page not found!");
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
          contentArea.innerHTML = "<h2>Page Not Found</h2>";
        }

        console.error(error);
      });
  }

  document.getElementsByTagName("body")[0].addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;

    if (target && target.getAttribute("data-page")) {
      loadPage(target.getAttribute("data-page"));
    }
  });

  loadPage("playlist"); // Load the home page initially
  drag();
  onScroll();
});

/*
document.querySelectorAll('.card-container').forEach((container, index) => {
  const cards = Array.from(container.children) as HTMLDivElement[];
  
  // Clone the first N cards (to make them reappear when leaving the screen)
  const numberOfClones = Math.ceil(cards.length / 2);
  for (let i = 0; i < numberOfClones; i++) {
    const clone = cards[i].cloneNode(true) as HTMLDivElement;
    container.appendChild(clone);
  }
});
*/

function drag() {
  const leftSplitter = document.getElementById(
    "left-splitter"
  ) as HTMLDivElement;
  const rightSplitter = document.getElementById(
    "right-splitter"
  ) as HTMLDivElement;
  const primaryBar = document.getElementById("primary-bar") as HTMLDivElement;
  const pageContent = document.getElementById("page") as HTMLDivElement;
  const secondaryBar = document.getElementById(
    "secondary-bar"
  ) as HTMLDivElement;

  let isLeftDragging = false;
  let isRightDragging = false;

  // Mouse down on splitter
  leftSplitter.addEventListener("mousedown", (e) => {
    isLeftDragging = true;
  });

  // Mouse move while dragging
  document.addEventListener("mousemove", (e) => {
    if (!isLeftDragging) return;

    const containerWidth = window.innerWidth;
    let newWidthPercentage = (e.clientX / containerWidth) * 100;

    if (newWidthPercentage < 16.75) newWidthPercentage = 4;
    if (newWidthPercentage > 75) {
      secondaryBar.style.display = "none";
      newWidthPercentage = 75;
    } else {
      secondaryBar.style.display = "flex";
    }

    primaryBar.style.width = `${newWidthPercentage}%`;
    pageContent.style.width = `${100 - newWidthPercentage}%`;
  });

  // Stop dragging on mouse up
  document.addEventListener("mouseup", () => {
    if (isLeftDragging) {
      isLeftDragging = false;
    }
  });

  rightSplitter.addEventListener("mousedown", (e) => {
    isRightDragging = true;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isRightDragging) return;

    const containerWidth = window.innerWidth;
    let newWidthPercentage =
      ((containerWidth - e.clientX) / containerWidth) * 100;

    if (newWidthPercentage < 16.6) newWidthPercentage = 16.6;
    if (newWidthPercentage > 25) newWidthPercentage = 25;

    secondaryBar.style.width = `${newWidthPercentage}%`;
    pageContent.style.width = `${100 - newWidthPercentage}%`;
  });

  // Stop dragging on mouse up
  document.addEventListener("mouseup", () => {
    if (isRightDragging) {
      isRightDragging = false;
    }
  });
}

function onScroll() {
  primaryBarOnScroll();
  pageOnScroll();
  secondaryBarOnScroll();
}

function primaryBarOnScroll() {
  const primaryBarContent = document.getElementById("playlists");
  const primaryHeader = document.getElementById("primary-bar-header");

  primaryBarContent.addEventListener("scroll", function () {
    if (primaryBarContent.scrollTop > 0) {
      primaryHeader.classList.add("scroll-shadow");
    } else {
      primaryHeader.classList.remove("scroll-shadow");
    }
  });
}

function pageOnScroll() {
  //- TO DO
}

function secondaryBarOnScroll() {
  const secondaryBarContent = document.getElementById("secondary-bar-content");
  const secondaryHeader = document.getElementById("secondary-bar-header");

  secondaryBarContent.addEventListener("scroll", function () {
    if (secondaryBarContent.scrollTop > 0) {
      secondaryHeader.classList.add("scroll-shadow");
    } else {
      secondaryHeader.classList.remove("scroll-shadow");
    }
  });
}
