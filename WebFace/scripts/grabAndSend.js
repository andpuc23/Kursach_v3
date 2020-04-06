// const button = document.getElementById('sendButton');
const button = document.querySelector('sendButton');

function sendData(data){
    const xhr = new XMLHttpRequest(),
        fd = new FormData(inputs);

    for (name in data){
        fd.append(name, data[name]);

        xhr.addEventListener('load', function(event){
            console.log('data sent, response loaded', event)
        });

        xhr.addEventListener('error', function (event) {
            console.log('some shit happened', event)
        });

        xhr.open('GET', 'localhost:8080');
        xhr.send(fd);

    }
}

button.onclick(function () {
    sendData({Request:"test request"})
});
//
// button.addEventListener('click', function(){
//     sendData({Request:"test request"})
// });