// Patch window to include myElectronAPI
// this is defined in `/src-electron/electron-preload.ts`
declare module 'my-electron-api' {
  global {
    interface Window {
      myElectronAPI?: {
        quit: () => void;
        send: (channel: string, data: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
      };
    }
  }
}
