var username = ipc.sendSync('data', 'username');

// prevent going back
history.go = function () { };

var usernameElement = document.getElementById('username');
if (usernameElement) {
    usernameElement.innerHTML = username;
}
