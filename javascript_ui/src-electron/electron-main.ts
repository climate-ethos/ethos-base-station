import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import PowerSaveBlockerController from './PowerSaveBlockerController';

// So that date can be set
import { exec } from 'child_process';

// Enable speech synthesis flag
app.commandLine.appendSwitch('enable-speech-dispatcher');

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

const isValidDateTime = (dateTime: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
  return regex.test(dateTime);
};

ipcMain.on('set-system-time', (event, newTime) => {
  if (newTime && isValidDateTime(newTime)) {
    exec(`sudo -n date --set="${newTime}"`, (error, stdout, stderr) => {
      if (error) {
        event.reply('set-system-time-response', {
          success: false,
          message: `Error setting time: ${error}`,
        });
        return;
      }
      if (stderr) {
        event.reply('set-system-time-response', {
          success: false,
          message: `Stderr setting time: ${stderr}`,
        });
        return;
      }
      event.reply('set-system-time-response', {
        success: true,
        message: `Time set to: ${stdout}`,
      });
    });
  } else {
    event.reply('set-system-time-response', {
      success: false,
      message: `Invalid datetime format: ${newTime}`,
    });
  }
});
