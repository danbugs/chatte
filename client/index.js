let form_index = document.querySelector('form#index');
let server = (location.hostname === 'localhost') ? 'http://localhost:3000/' : 'https://chatte-server.now.sh/';
form_index.addEventListener('submit', e => {
    e.preventDefault();
    let form_data_index = new FormData(form_index);
    let info = {
        room: form_data_index.get("room"),
        chatter: form_data_index.get("chatter")
    };
    sessionStorage.setItem("room", form_data_index.get('room'));
    sessionStorage.setItem("chatter", form_data_index.get('chatter'));
    console.log(location.port);
    location.href = (location.hostname === 'localhost') ?
        'http://localhost:'+location.port+'/chatte.html' : 'https://chatte.now.sh/chatte.html';
});