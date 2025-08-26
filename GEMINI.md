# GEMINI.md - Project Overview

## Project Overview

This project is a Chrome browser extension for a to-do list, built with Vue.js. It allows users to manage their tasks through a popup interface. The application is structured as a modern front-end project using Vite for the build tooling, Vue.js for the user interface, Pinia for state management, and Element Plus as the component library.

The extension's core functionality is delivered through a popup (`index.html` and the Vue app), a background service worker (`public/background.js`), and a content script (`public/content.js`) that can interact with web pages. State persistence is handled by a custom utility (`src/utils/ChromeExtensionStorage.js`) that wraps Chrome's `storage.local` API, ensuring data is saved and synchronized across browser sessions.

### Key Technologies

*   **Framework:** Vue.js 3
*   **Build Tool:** Vite
*   **State Management:** Pinia
*   **UI Library:** Element Plus
*   **Routing:** Vue Router
*   **Language:** JavaScript

## Building and Running

The project's scripts are defined in `package.json`.

*   **To run the development server:**
    ```bash
    npm run dev
    ```
    This will start a Vite development server. To test the extension, you'll need to load the `dist` directory as an unpacked extension in Chrome's developer mode.

*   **To build the extension for production:**
    ```bash
    npm run build
    ```
    This command bundles the application into the `dist` directory, which can then be packed or loaded as an unpacked extension.

*   **To preview the production build locally:**
    ```bash
    npm run preview
    ```

## Development Conventions

*   **State Management:** All application state related to to-do items is managed in a central Pinia store located at `src/stores/todoStore.js`. This store handles all CRUD (Create, Read, Update, Delete) operations, as well as data persistence and synchronization.
*   **Chrome Storage:** Interaction with the Chrome Extension's storage API is abstracted away in `src/utils/ChromeExtensionStorage.js`. This keeps the state management logic clean and decoupled from the browser-specific APIs.
*   **Component Structure:** The application is organized into components (`src/components`) and views (`src/views`), following standard Vue.js conventions.
*   **Routing:** Navigation within the extension's popup is handled by Vue Router, with routes defined in `src/router/index.js`.
*   **Messaging:** The extension uses Chrome's message passing system to communicate between the Vue app (popup), the background script, and content scripts. The message listener setup in `src/App.vue` is a key part of this communication.
