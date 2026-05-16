const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let flaskProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hidden',
    backgroundColor: '#020617',
  });

  // In production, we'd load the build/index.html
  // In dev, we load the Vite dev server
  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startFlask() {
  // Start Flask backend
  // Assuming python is in PATH
  flaskProcess = spawn('python', [path.join(__dirname, '../backend/app.py')]);

  flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask: ${data}`);
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask Error: ${data}`);
  });
}

app.on('ready', () => {
  startFlask();
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
  if (flaskProcess) flaskProcess.kill();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
