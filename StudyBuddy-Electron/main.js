const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const JsonDataStore = require('./src/helpers/JsonDataStore');
const SettingsHandler = require('./src/helpers/SettingsHandler');

// Load environment variables
require('dotenv').config();

// Initialize store and helpers
const store = new Store();
let mainWindow;
let dataStore;
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
  // Initialize JSON data store and settings
  dataStore = new JsonDataStore();
  settingsHandler = new SettingsHandler();
  
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

// Data operations
ipcMain.handle('db-query', async (event, query, params) => {
  // Legacy support - not used anymore
  return [];
});

ipcMain.handle('db-get-sessions', async (event, limit) => {
  dataStore.logActivity('database', 'get-sessions', { limit });
  return dataStore.getSessions(limit);
});

ipcMain.handle('db-get-flashcards', async () => {
  dataStore.logActivity('database', 'get-flashcards');
  return dataStore.getFlashcards();
});

ipcMain.handle('db-save-session', async (event, session) => {
  dataStore.logActivity('database', 'save-session', { topic: session.topic });
  return dataStore.saveSession(session);
});

ipcMain.handle('db-save-flashcard', async (event, flashcard) => {
  dataStore.logActivity('database', 'save-flashcard');
  return dataStore.saveFlashcard(flashcard);
});

ipcMain.handle('db-update-flashcard', async (event, id, data) => {
  dataStore.logActivity('database', 'update-flashcard', { id });
  return dataStore.updateFlashcard(id, data);
});

ipcMain.handle('db-delete-flashcard', async (event, id) => {
  dataStore.logActivity('database', 'delete-flashcard', { id });
  return dataStore.deleteFlashcard(id);
});

// Get database statistics
ipcMain.handle('db-get-stats', async () => {
  return dataStore.getStats();
});

// Module state persistence
ipcMain.handle('save-module-state', async (event, moduleName, state) => {
  dataStore.saveModuleState(moduleName, state);
  return true;
});

ipcMain.handle('get-module-state', async (event, moduleName) => {
  return dataStore.getModuleState(moduleName);
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

// Gemini API handlers with logging
ipcMain.handle('gemini-generate-summary', async (event, text, apiKey) => {
  try {
    const GeminiApiClient = require('./src/helpers/GeminiApiClient');
    const client = new GeminiApiClient(apiKey);
    const response = await client.generateSummary(text);
    dataStore.saveAIResponse('summarizer', text.substring(0, 100), response);
    dataStore.logActivity('ai', 'generate-summary', { textLength: text.length });
    return response;
  } catch (error) {
    dataStore.logError('summarizer', error, { action: 'generate-summary' });
    throw error;
  }
});

ipcMain.handle('gemini-generate-quiz', async (event, topic, apiKey) => {
  try {
    const GeminiApiClient = require('./src/helpers/GeminiApiClient');
    const client = new GeminiApiClient(apiKey);
    const response = await client.generateQuiz(topic);
    dataStore.saveAIResponse('quiz', topic, response);
    dataStore.logActivity('ai', 'generate-quiz', { topic });
    return response;
  } catch (error) {
    dataStore.logError('quiz', error, { action: 'generate-quiz', topic });
    throw error;
  }
});

ipcMain.handle('gemini-generate-mnemonics', async (event, topic, apiKey) => {
  try {
    const GeminiApiClient = require('./src/helpers/GeminiApiClient');
    const client = new GeminiApiClient(apiKey);
    const response = await client.generateMnemonics(topic);
    dataStore.saveAIResponse('summarizer', topic, response, { type: 'mnemonics' });
    dataStore.logActivity('ai', 'generate-mnemonics', { topic });
    return response;
  } catch (error) {
    dataStore.logError('summarizer', error, { action: 'generate-mnemonics', topic });
    throw error;
  }
});

ipcMain.handle('gemini-generate-problems', async (event, topic, difficulty, apiKey) => {
  try {
    const GeminiApiClient = require('./src/helpers/GeminiApiClient');
    const client = new GeminiApiClient(apiKey);
    const response = await client.generateProblems(topic, difficulty);
    dataStore.saveAIResponse('problems', topic, response, { difficulty });
    dataStore.logActivity('ai', 'generate-problems', { topic, difficulty });
    return response;
  } catch (error) {
    dataStore.logError('problems', error, { action: 'generate-problems', topic });
    throw error;
  }
});

ipcMain.handle('gemini-generate-schedule', async (event, topics, hoursPerDay, apiKey) => {
  try {
    const GeminiApiClient = require('./src/helpers/GeminiApiClient');
    const client = new GeminiApiClient(apiKey);
    const response = await client.generateStudySchedule(topics, hoursPerDay);
    dataStore.saveAIResponse('optimizer', topics, response, { hoursPerDay });
    dataStore.saveSchedule({ topics, hoursPerDay, content: response });
    dataStore.logActivity('ai', 'generate-schedule', { topics });
    return response;
  } catch (error) {
    dataStore.logError('optimizer', error, { action: 'generate-schedule', topics });
    throw error;
  }
});

ipcMain.handle('gemini-test-connection', async (event, apiKey) => {
  try {
    const GeminiApiClient = require('./src/helpers/GeminiApiClient');
    const client = new GeminiApiClient(apiKey);
    const result = await client.testConnection();
    dataStore.logActivity('settings', 'test-api-connection', { success: result });
    return result;
  } catch (error) {
    dataStore.logError('settings', error, { action: 'test-connection' });
    throw error;
  }
});

console.log('Study Buddy Pro - Electron App Started');
