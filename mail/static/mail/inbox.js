document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);
    document.querySelector('#logout').addEventListener('click', logout);

    load_mailbox('inbox');
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function compose_email() {

    // 
    document.getElementById("compose-form").addEventListener("submit", function (event) {
        event.preventDefault();
    });

    // 
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#email-body').style.display = 'none';

    // 
    document.querySelector('#ansver').style.display = 'none';
    document.querySelector('#archivation_group').style.display = 'none';

    // 
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

    // 
    document.querySelector('#compose-form').onsubmit = function () {

        // 
        var recipients = document.querySelector('#compose-recipients').value;
        if (!recipients) {
            alert('Треба поставити хоча б одного одержувача!!!');
            return false;
        }

        var subject = document.querySelector('#compose-subject').value;
        var body = document.querySelector('#compose-body').value;

        // 
        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: recipients,
                subject: subject,
                body: body
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert(result.message);
            if (result.message == undefined) {
                alert(result.error);
                return false;
            }            

            // 
            load_mailbox('sent');

            // 
            document.getElementById("compose-form").requestSubmit("submit");
        });        
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function load_mailbox(mailbox) {

    // 
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {

        // 
        if (emails.error) {
            alert(emails.error);
            console.log(mailbox);
            console.log(emails.error);
            return false;
        }

        // 
        document.querySelector('#email-body').innerHTML = '';

        //
        document.querySelector('#emails-view').style.display = 'block';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#email-body').style.display = 'none';

        // 
        document.querySelector('#ansver').style.display = 'none';
        if (mailbox == 'inbox') {            
            document.querySelector('#archivation_group').style.display = 'block';
            document.querySelector('#archivation_group').innerHTML = 'Додайте листи в архів';
        } else if (mailbox == 'archive') {
            document.querySelector('#archivation_group').style.display = 'block';
            document.querySelector('#archivation_group').innerHTML = 'Отримати листи з архіву';
        } else {
            document.querySelector('#archivation_group').style.display = 'none';
        }
        

        document.querySelector('#header').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

        document.querySelector('#emails-view').innerHTML = [];
 
        const emailsList = document.querySelector('#emails-view');

        
        for (email of emails) {


            const div = document.createElement('div');
            const input = document.createElement('input');
            const button = document.createElement('button');
            const table = document.createElement('table');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            const td4 = document.createElement('td');


            input.type = 'checkbox';
            input.id = email.id;

            console.log(input);


            if (mailbox == 'inbox') {
                if (email.read === true) {
                    button.style.backgroundColor = 'grey';
                } else {
                    button.style.backgroundColor = 'white';
                }

            } else if (mailbox == 'sent') {
                button.style.backgroundColor = 'grey';

            } else {
                if (email.read === true) {
                    button.style.backgroundColor = 'grey';
                } else {
                    button.style.backgroundColor = 'white';
                }

            } 
            button.name = email.id;

            console.log(button);


            td1.innerHTML = `<b>Надісланий: ${email.sender}</b>;`;
            td2.innerHTML = `<b>Отримувач: ${email.recipients[0]}</b>;`;
            td3.innerHTML = `Тема: ${email.subject}`;
            td4.innerHTML = `(${email.timestamp})`;

  
            table.append(td1);
            table.append(td2);
            table.append(td3);
            table.append(td4);
            button.append(table);


            div.append(input);
            div.append(button);
         
            emailsList.append(div);
        }        

        email_onload();

        group_archive();
    })
}

function email_onload() {


    const container = document.querySelector('#emails-view');
    const buttons = container.querySelectorAll('button');

    console.log(container);
    console.log(buttons);

    buttons.forEach(function (button) {
        button.onclick = function () {
            fetch(`/emails/${button.name}`)
            .then(response => response.json())
            .then(email => {

               
                if (email.error) {
                    alert(email.error);
                    console.log(email);
                    console.log(email.error);
                    return false;
                }

                console.log("DOWNLOADED!!!");
                console.log(email);
                console.log(email.error);

                 
                document.querySelector('#compose-view').style.display = 'none';
                document.querySelector('#email-body').style.display = 'block';              

             
                document.querySelector('#ansver').style.display = 'block';
                document.querySelector('#archivation_group').style.display = 'block';

                const recipients = email.recipients;      
                const currentUser = localStorage.getItem('currentUser');

                console.log(recipients);

                for (recipient of recipients) {

                    console.log(email.user);
                    console.log(currentUser);

                    if (currentUser == recipient) {
                        if (email.archived == true) {
                            document.querySelector('#archivation_group').innerHTML = 'Отримати електронну пошту з архіву';
                        } else {
                            document.querySelector('#archivation_group').innerHTML = 'Додайте електронну адресу в архів';
                        }  
                    }
                }                               


                fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        read: true
                    })
                })

                console.log(email);

                document.querySelector('#email-body').innerHTML =
                    `<h4>${email.subject}</h4><br> Відправник: ${email.sender},<br> Одержувач: ${email.recipients},<br> ${email.timestamp}.<br> ${email.body}`;


                document.querySelector('#emails-view').style.display = 'none';


                document.querySelector('#archivation_group').onclick = function () {

                    console.log(email.archived);

                    archive(email);

                    console.log(email);
                    console.log(email.archived);

                    if (email.archived == false) {
                        load_mailbox('archive');
                    } else {
                        load_mailbox('inbox');
                    }
                }                


                answer(email);
            });
        }
    });    
}

function archive(email) {
    if (email.archived == true) {


        fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: false                    
            })
        })
    } else {

  
        fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: true
            })
        })
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function answer(email) {
    document.querySelector('#ansver').onclick = function () {


        const newRecipient = email.sender;
        const newSubject = email.subject;
        const newBody = email.body;
        const newTimestampt = email.timestamp;

        compose_email();
        document.querySelector('#compose-recipients').value = newRecipient;
        document.querySelector('#compose-subject').value = 'Re: ' + newSubject;
        document.querySelector('#compose-body').value = `On ${newTimestampt} ${newRecipient} wrote ${newBody}`;
    }
}

function group_archive() {

    
    const readyToArchive = [];

    console.log(readyToArchive);


    const container = document.querySelector('#emails-view');
    container.querySelectorAll('input').forEach(function (input) {
        input.onclick = function () {
            fetch(`/emails/${input.id}`)
            .then(response => response.json())
            .then(email => {
                console.log(input.id);
                console.log(email);

                if (readyToArchive.length != 0) {
                    for (let i = 0, n = readyToArchive.length; i < n; i++) {
                        let checkedMail = readyToArchive[i];
                        if (checkedMail.id == email.id) {
                            readyToArchive.splice(i, 1);
                            break;
                        } else if (checkedMail.id != email.id && i == n - 1) {
                            readyToArchive.push(email);
                        } else {
                            continue;
                        }
                    }
                } else {
                    readyToArchive.push(email);
                }                

                console.log(readyToArchive);
            });
        }
    });


    document.querySelector('#archivation_group').onclick = function () {

        if (readyToArchive.length == 0) {
            alert('You have to choose at least one email for achivation!!!');
            return false;
        }

        console.log('ARCHIVING');

        var emailsArchived;

        for (email of readyToArchive) {
            console.log(email);
            console.log(emailsArchived);

            archive(email);
            emailsArchived = email.archived;

            console.log(email);
            console.log(emailsArchived);
        }


        if (emailsArchived == false) {
            load_mailbox('archive');
        } else {
            load_mailbox('inbox');
        }
        
    };
}


function logout() {
    localStorage.removeItem('currentUser');
    var currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);
}