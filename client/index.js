let form = document.querySelector('form#transmitter');
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let form_data = new FormData(form);
    let message = {
        room: form_data.get('room'),
        message: form_data.get('message')
    }

    fetch('http://localhost:3001/message', 
    {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(result => {
        $('#receiver').html(JSON.stringify(result));
        console.log(result);
    })
    .catch(e => console.log('ERROR: ', e));
});

setInterval(() => {
    fetch('http://localhost:3001/', 
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(result => {
        $('#receiver').html(JSON.stringify(result));
        console.log(result);
    })
    .catch(e => console.log('ERROR: ', e));

}, 1000)