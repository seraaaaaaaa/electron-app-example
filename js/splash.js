var ipc = require('electron').ipcRenderer;

// prevent going back
history.go = function () { };

setTimeout(function () {
    ipc.send('page', 'html/login.html');
}, 2000); // wait 2s
