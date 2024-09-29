var ipc = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', function () {

    var version = ipc.sendSync('data', 'version');
    var versionElement = document.getElementById('version');
    if (versionElement) {
        versionElement.innerHTML = version;
    }

    var minBtn = document.getElementById('minBtn');
    if (minBtn) {
        minBtn.addEventListener('click', function () {
            ipc.send('remote', 'min');
        });
    }

    var maxBtn = document.getElementById('maxBtn');
    if (maxBtn) {
        maxBtn.addEventListener('click', function () {
            ipc.send('remote', 'max');
        });
    }

    var closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            var closeWinModal = document.getElementById('closeWinModal');
            if (closeWinModal) {
                // Assuming you're using Bootstrap's modal, this line will show the modal.
                new bootstrap.Modal(closeWinModal).show();
            }
        });
    }

    var closeWinBtn = document.getElementById('closeWinBtn');
    if (closeWinBtn) {
        closeWinBtn.addEventListener('click', function () {
            ipc.send('remote', 'close');
        });
    }

    var restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function () {
            ipc.send('remote', 'restart');
        });
    }
});
