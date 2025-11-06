const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const JsonDataStore = require('./src/helpers/JsonDataStore');
const SettingsHandler = require('./src/helpers/SettingsHandler');

// Initialize store and helpers
const store = new Store();
let mainWindow;
let dataStore;
let settingsHandler;
let spotifyAuthWindow = null;
let spotifyAuthServer = null;

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
      enableRemoteModule: true,
      webSecurity: false, // Allow iframes from external sources like YouTube
      allowRunningInsecureContent: true
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
  
  // Track window minimize/restore state for floating timer
  mainWindow.on('minimize', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('window-minimized', true);
    }
  });
  
  mainWindow.on('restore', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('window-minimized', false);
    }
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
  dataStore.logActivity('module', 'save-state', { moduleName });
  return true;
});

ipcMain.handle('get-module-state', async (event, moduleName) => {
  return dataStore.getModuleState(moduleName);
});

// Activity logging
ipcMain.handle('log-activity', async (event, moduleName, action, details = {}) => {
  dataStore.logActivity(moduleName, action, details);
  return true;
});

// Error logging
ipcMain.handle('log-error', async (event, moduleName, error, context = {}) => {
  dataStore.logError(moduleName, error, context);
  return true;
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

// Spotify Integration Handlers

ipcMain.handle('open-spotify-auth', async (event, authUrl) => {
  return new Promise((resolve, reject) => {
    // Create a simple HTTP server to handle the callback
    const http = require('http');
    const url = require('url');
    
    // Close existing server if any
    if (spotifyAuthServer) {
      spotifyAuthServer.close();
    }
    
    spotifyAuthServer = http.createServer((req, res) => {
      const queryData = url.parse(req.url, true).query;
      
      if (queryData.code) {
        // Success - send a nice response page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Spotify Connected</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                text-align: center;
              }
              h1 { color: #1db954; margin-bottom: 20px; }
              p { color: #666; font-size: 16px; }
              .icon { font-size: 64px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✅</div>
              <h1>Successfully Connected!</h1>
              <p>You can now close this window and return to Study Buddy.</p>
            </div>
            <script>setTimeout(() => window.close(), 3000);</script>
          </body>
          </html>
        `);
        
        // Close the server
        setTimeout(() => {
          if (spotifyAuthServer) {
            spotifyAuthServer.close();
            spotifyAuthServer = null;
          }
        }, 1000);
        
        // Close auth window if open
        if (spotifyAuthWindow && !spotifyAuthWindow.isDestroyed()) {
          spotifyAuthWindow.close();
        }
        
        resolve(queryData.code);
      } else if (queryData.error) {
        // Error occurred
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Authorization Failed</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                text-align: center;
              }
              h1 { color: #ff6b6b; margin-bottom: 20px; }
              p { color: #666; font-size: 16px; }
              .icon { font-size: 64px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">❌</div>
              <h1>Authorization Failed</h1>
              <p>Please try again.</p>
            </div>
            <script>setTimeout(() => window.close(), 3000);</script>
          </body>
          </html>
        `);
        
        setTimeout(() => {
          if (spotifyAuthServer) {
            spotifyAuthServer.close();
            spotifyAuthServer = null;
          }
        }, 1000);
        
        if (spotifyAuthWindow && !spotifyAuthWindow.isDestroyed()) {
          spotifyAuthWindow.close();
        }
        
        reject(new Error(queryData.error));
      }
    });
    
    // Start server on port 3000
    spotifyAuthServer.listen(3000, () => {
      console.log('Spotify auth callback server running on http://localhost:3000');
    });
    
    // Open authorization window
    spotifyAuthWindow = new BrowserWindow({
      width: 800,
      height: 700,
      webPreferences: {
        nodeIntegration: false
      },
      autoHideMenuBar: true,
      title: 'Connect to Spotify'
    });
    
    spotifyAuthWindow.loadURL(authUrl);
    
    spotifyAuthWindow.on('closed', () => {
      spotifyAuthWindow = null;
      if (spotifyAuthServer) {
        spotifyAuthServer.close();
        spotifyAuthServer = null;
      }
    });
  });
});

ipcMain.handle('save-spotify-tokens', async (event, tokens) => {
  try {
    store.set('spotify', tokens);
    return true;
  } catch (error) {
    console.error('Error saving Spotify tokens:', error);
    throw error;
  }
});

ipcMain.handle('load-spotify-tokens', async () => {
  try {
    return store.get('spotify', null);
  } catch (error) {
    console.error('Error loading Spotify tokens:', error);
    return null;
  }
});

ipcMain.handle('clear-spotify-tokens', async () => {
  try {
    store.delete('spotify');
    return true;
  } catch (error) {
    console.error('Error clearing Spotify tokens:', error);
    throw error;
  }
});

console.log('Study Buddy Pro - Electron App Started');
