const { contextBridge } = require('electron');

// Secure preload — exposes a minimal, read-only API to the renderer.
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  version: process.versions.electron,
});
