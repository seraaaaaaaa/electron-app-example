// prevent going back
history.go = function () { };

var defaultUser = ipc.sendSync('data', 'username');
var usernameInput = document.getElementById('username');

if (usernameInput) {
    usernameInput.value = defaultUser === '-' ? '' : defaultUser;
}

// Trigger login when pressing enter
var form = document.querySelector('form');
if (form) {
    form.addEventListener('keyup', function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            document.getElementById('loginBtn').click();
        }
    });

    form.addEventListener('keypress', function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            document.getElementById('loginBtn').click();
        }
    });
}

var loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', function (event) {
        var username = usernameInput.value;

        var form = document.getElementById('loginForm');
        form.classList.add('was-validated');

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        var userdata = 'username=' + username;
        ipc.send('prefs', userdata);

        // Maximize window
        ipc.send('remote', 'enlarge');

        // Navigate to index page
        window.location.href = '../html/index.html';
    });
}

