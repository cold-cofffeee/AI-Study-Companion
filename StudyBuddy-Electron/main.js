const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const DatabaseHelper = require('./src/helpers/DatabaseHelper');
const SettingsHandler = require('./src/helpers/SettingsHandler');

// Load environment variables
require('dotenv').config();

// Initialize store and helpers
const store = new Store();
let mainWindow;
let databaseHelper;
let settingsHandler;

function createWindow() {
  // Load window settings
  const settings = store.get('windowSettings', {
    width: 1400,
    height: 900,
    x: undefined,
    y: undefined
  });

  mainWindow = new BrowserWindow({
    width: settings.width,
    height: settings.height,
    x: settings.x,
    y: settings.y,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Study Buddy Pro - AI-Powered Learning Companion',
    show: false,
    backgroundColor: '#f5f5f5'
  });

  // Load the main HTML file
  mainWindow.loadFile('src/views/index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (settings.maximized) {
      mainWindow.maximize();
    }
  });

  // Save window position and size on close
  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();
    const isMaximized = mainWindow.isMaximized();
    
    store.set('windowSettings', {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      maximized: isMaximized
    });
  });

  // Open DevTools in development mode (optional)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  // Initialize database and settings
  databaseHelper = new DatabaseHelper();
  settingsHandler = new SettingsHandler();
  
  await databaseHelper.initialize();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// Settings operations
ipcMain.handle('get-settings', async () => {
  return await settingsHandler.getSettings();
});

ipcMain.handle('save-settings', async (event, settings) => {
  return await settingsHandler.saveSettings(settings);
});

ipcMain.handle('update-setting', async (event, key, value) => {
  return await settingsHandler.updateSetting(key, value);
});

// Database operations
ipcMain.handle('db-query', async (event, query, params) => {
  return await databaseHelper.query(query, params);
});

ipcMain.handle('db-get-sessions', async (event, limit) => {
  return await databaseHelper.getRecentSessions(limit);
});

ipcMain.handle('db-get-flashcards', async () => {
  return await databaseHelper.getDueFlashcards();
});

ipcMain.handle('db-save-session', async (event, session) => {
  return await databaseHelper.saveStudySession(session);
});

ipcMain.handle('db-save-flashcard', async (event, flashcard) => {
  return await databaseHelper.saveFlashcard(flashcard);
});

ipcMain.handle('db-update-flashcard', async (event, id, data) => {
  return await databaseHelper.updateFlashcard(id, data);
});

// File dialogs
ipcMain.handle('show-save-dialog', async (event, options) => {
  return await dialog.showSaveDialog(mainWindow, options);
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  return await dialog.showOpenDialog(mainWindow, options);
});

// Export functions
ipcMain.handle('export-pdf', async (event, data) => {
  const ExportHelper = require('./src/helpers/ExportHelper');
  return await ExportHelper.exportToPDF(data);
});

ipcMain.handle('export-image', async (event, data) => {
  const ExportHelper = require('./src/helpers/ExportHelper');
  return await ExportHelper.exportToImage(data);
});

// Notification
ipcMain.handle('show-notification', (event, title, body) => {
  const { Notification } = require('electron');
  new Notification({ title, body }).show();
});

// Gemini API handlers
ipcMain.handle('gemini-generate-summary', async (event, text, apiKey) => {
  const GeminiApiClient = require('./src/helpers/GeminiApiClient');
  const client = new GeminiApiClient(apiKey);
  return await client.generateSummary(text);
});

ipcMain.handle('gemini-generate-quiz', async (event, topic, apiKey) => {
  const GeminiApiClient = require('./src/helpers/GeminiApiClient');
  const client = new GeminiApiClient(apiKey);
  return await client.generateQuiz(topic);
});

ipcMain.handle('gemini-generate-mnemonics', async (event, topic, apiKey) => {
  const GeminiApiClient = require('./src/helpers/GeminiApiClient');
  const client = new GeminiApiClient(apiKey);
  return await client.generateMnemonics(topic);
});

ipcMain.handle('gemini-generate-problems', async (event, topic, difficulty, apiKey) => {
  const GeminiApiClient = require('./src/helpers/GeminiApiClient');
  const client = new GeminiApiClient(apiKey);
  return await client.generateProblems(topic, difficulty);
});

ipcMain.handle('gemini-generate-schedule', async (event, topics, hoursPerDay, apiKey) => {
  const GeminiApiClient = require('./src/helpers/GeminiApiClient');
  const client = new GeminiApiClient(apiKey);
  return await client.generateStudySchedule(topics, hoursPerDay);
});

ipcMain.handle('gemini-test-connection', async (event, apiKey) => {
  const GeminiApiClient = require('./src/helpers/GeminiApiClient');
  const client = new GeminiApiClient(apiKey);
  return await client.testConnection();
});

console.log('Study Buddy Pro - Electron App Started');
