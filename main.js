const electron = require("electron");
const { app, BrowserWindow } = electron;
const path = require("path");
const globalShortcut = electron.globalShortcut;
const ipc = electron.ipcMain;
const settings = require("electron-settings");

// Request a single instance lock
const gotSingleInstanceLock = app.requestSingleInstanceLock();
let mainWindow;

//console.log('File used for  Data - ' + settings.file());

async function createWindow() {
    var all = "-";
    await settings.get().then((value) => {
        all = value == undefined ? "-" : value;
    });

    var username = "-";
    await settings.get("username").then((value) => {
        username = value == undefined ? "-" : value;
    });

    var version = app.getVersion();

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 500,
        height: 300,
        minWidth: 500,
        minHeight: 300,
        backgroundColor: "#f4f4f4",
        title: "Electron App",
        autoHideMenuBar: true,
        frame: false,
        icon: path.join(__dirname, "./icon.ico"),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    //to splash screen first
    mainWindow.loadURL(path.join(__dirname, "html/splash.html"));
    mainWindow.center();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    //Press f5 to refresh
    globalShortcut.register("f5", function () {
        mainWindow.reload();
    });

    //from splash redirect to pages (data == pageName)
    ipc.on("page", function (event, data) {
        mainWindow.loadURL(path.join(__dirname, data));
        mainWindow.setSize(500, 700, true);
        mainWindow.center();
    });

    // redirect to pages (data == pageName)
    ipc.on("redirect", function (event, data) {
        mainWindow.loadURL(path.join(__dirname, data));
    });

    //save data to settings.json
    ipc.on("prefs", function (event, data) {
        if (data) {
            var splittedData = data.split("=");

            if (splittedData.length > 0) {
                if (splittedData[0] == "username") {
                    //username
                    username = splittedData[1];
                }

                settings.set({ username: username });
            }
        }
    });

    //control minimize, maximize, resize, close of window
    ipc.on("remote", function (event, data) {
        if (data == "min") {
            mainWindow.minimize();
        } else if (data == "max") {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        } else if (data == "close") {
            mainWindow.close();
        } else if (data == "enlarge") {
            if (!mainWindow.isMaximized()) {
                mainWindow.maximize();
            }
        } else if (data == "resize") {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            }
            mainWindow.setSize(500, 700, false);
        } else if (data == "restart") {
            app.relaunch();
            app.exit();
        }
    });

    //return data
    ipc.on("data", function (event, data) {
        if (data == "username") {
            event.returnValue = username;
        } else if (data == "version") {
            event.returnValue = "Version " + version + " © 2024";
        } else {
            event.returnValue = all;
        }
    });

}


if (!gotSingleInstanceLock) {
    // If another instance is already running, quit the new one
    app.quit();
} else {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
        createWindow();

        app.on("activate", function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });

        // Listen for second-instance event
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, so bring the first one to focus
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.focus();
            }
        });
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", () => {
        app.quit();
    });
}
