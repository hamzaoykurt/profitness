const { app, BrowserWindow } = require('electron');
const path = require('path');

// Geliştirme ortamı (dev) kontrolü
// npm run electron:dev komutu ile çalıştırıldığında NODE_ENV=development olabilir 
// veya basitçe localhost'a bağlanmayı deneyebiliriz.
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (isDev) {
    // Vite dev sunucusu (wait-on ile bekleyeceğiz)
    win.loadURL('http://localhost:5173');
    // Geliştirici araçlarını aç
    win.webContents.openDevTools();
  } else {
    // Production build
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
