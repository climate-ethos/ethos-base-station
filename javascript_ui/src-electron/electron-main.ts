import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import PowerSaveBlockerController from './PowerSaveBlockerController';

// Controller which handles logic to prevent device screen sleep during day
const powerSaveBlockerController = new PowerSaveBlockerController();

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

// add electron remote for app.quit()
import { initialize, enable } from '@electron/remote/main';
initialize();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1280,
    height: 800,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: false, // <-- to be able to import @electron/remote in preload script
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
    kiosk: process.env.NODE_ENV === 'production' ? true : false, // kiosk mode 'locks' the window
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  // Setup handling to prevent screen turning off/sleeping
  // this only applies from 5am-9pm
  powerSaveBlockerController.start();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Clear handling preventing screen turning off
  powerSaveBlockerController.stop();

  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
