import * as nn from "./networks.js";
const url = "http://localhost:8888";

var isLearning = false;
var timerIndex = 0;

function connectAndSend(data){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
            return xhr.responseText;
        else
            console.log("error occured" + xhr.responseText);
    };

}

function startStop(){
    if (!isLearning)
        sendStartFit();
    else
        sendStopFit();
    isLearning = !isLearning;
}

function sendStartFit() {
    connectAndSend("train forever");
}

function sendStopFit(){
    connectAndSend('train stop');
}

function doStep(){
    timerIndex++;
    connectAndSend('train once');
}

function sendReset() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = "update network";
    xhr.send(data);
}

function grabData() {

}
