document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#login_submit').onsubmit = function () {

        
        var email = document.querySelector('#login_email').value;
        var password = document.querySelector('#login_password').value;

        if (!email) {
            alert('Будь ласка, введіть адресу електронної пошти!');
            return false;
        }

        if (!password) {
            alert('Будь ласка, введіть пароль!');
            return false;
        }

        localStorage.setItem('currentUser', email);

        var currentUser = localStorage.getItem('currentUser');
        console.log(currentUser);

        return true;
    };
});


