import * as nn from "./networks.js";
const URL = "http://localhost:8080";

var isLearning = false;
var timerIndex = 0;

var network = null;

function connectAndSend(data){
    $.ajax({
        url: URL,
        type: "get",
        data: {"Request": data},
        success: function (response) {
            console.log(response);
            if (response.startsWith('MLP'))
                network = nn.Mlp(response.substr(4));
            else if (response.startsWith('RBF'))
                network = nn.Rbf(response.substr(4));
        },
        error: function (response) {
            console.error(response)
        }
    });
}

function startStop(){
    if (network !== null){
        if (!isLearning)
            sendStartFit();
        else
            sendStopFit();
        isLearning = !isLearning;
    }

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
    let data = "update network";
    let params = grabData();
    for (let i = 0; i < params.length; i++) {
        data += " " + params[i];
    }
    connectAndSend(data);
    timerIndex = 0;
}

function grabData() {

    let shape = "1,1,1";
    let inputs = "X,Y"; //todo прописать нормальную форму
    let net_type = document.getElementById("NNtype").value;
    let learn_rate = document.getElementById("myLearningRate").value;
    if (net_type === 'mlp') {
        let activation = document.getElementById("myActivations").value;
        let regularization = document.getElementById("myRegularizations").value;
        let regularizationRate = document.getElementById("myRegularizationRate").value;
        return [net_type, shape, activation, learn_rate, regularizationRate, regularization, inputs];
    }
    else{ //net_type == 'rbf'
        return [net_type, learn_rate]
    }


}
