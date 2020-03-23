if(sessionStorage.getItem('room')){
    let server = location.hostname === 'localhost' ? ('http://localhost:3000/') : ('https://chatte-server.now.sh/');
    let form = document.querySelector('form#transmitter');
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let form_data = new FormData(form);
        let message = {
            room: sessionStorage.getItem('room'),
            chatter: sessionStorage.getItem('chatter'),
            message: form_data.get('message')
        }
        fetch(server + 'message', 
        {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(_ => console.log('OK'))
        .catch(e => console.log('ERROR: ', e));
    });
    
    setInterval(() => {
        let room = {
            room: sessionStorage.getItem('room')
        };
        
        fetch(server + 'fetch_messages', 
        {
            method: 'POST',
            body: JSON.stringify(room),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(result => {
            if(result[0] === undefined){
                $('#receiver').html(
                    `
                    <p>No messages yet ~</p>
                    `
                );
            }else{
                result.sort((a, b) => (a.views > b.views) ? 1 : -1);
                $('#receiver').html('');
                for(let i = 0; i < result.length; i++){
                    $('#receiver').append(
                        `
                        <p><b>${result[i].chatter} said:</b> ${result[i].message}</p>
                        `
                    )
                }
            }
        })
        .catch(e => console.log('ERROR: ', e));

    }, 2000);
}   
else{
    $('main').html(
        `
        <div class="container text-center">
                <h1>Nope! ッ</h1>
                <p>You still have to login yet ~</p>
        </div>
        `
    )
}