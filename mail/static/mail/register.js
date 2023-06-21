document.addEventListener('DOMContentLoaded', function () {

    console.log('inside!');    

    document.querySelector('#register-form').onsubmit = function () {

        console.log('submitted!');

        var email = document.querySelector('#register-email').value;
        var password = document.querySelector('#register-password').value;
        var confirmation = document.querySelector('#register-confirmation').value;

        if (!email) {
            alert('Будь ласка, введіть адресу електронної пошти!');
            return false;
        }

        if (!password) {
            alert('Будь ласка, введіть пароль!');
            return false;
        }

        if (!confirmation) {
            alert('Будь ласка, підтвердження введення!');
            return false;
        }

        if (password != confirmation) {
            alert('Пароль не той самий!');
            return false;
        }

        return true;
    };
})


