let form_index = document.querySelector('form#index');
let server = (location.hostname === 'localhost') ? 'http://localhost:3000/' : 'https://yachapp-server.now.sh/';
form_index.addEventListener('submit', e => {
    e.preventDefault();
    let form_data_index = new FormData(form_index);
    let info = {
        room: form_data_index.get("room"),
        chapper: form_data_index.get("chapper")
    };
    sessionStorage.setItem("room", form_data_index.get('room'));
    sessionStorage.setItem("chapper", form_data_index.get('chapper'));
    console.log(location.port);
    location.href = (location.hostname === 'localhost') ?
        'http://localhost:'+location.port+'/yachapp.html' : 'https://yachapp.now.sh/yachapp.html';
});