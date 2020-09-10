const URL = "http://localhost:8080";

let isLearning = false;
let timerIndex = 0;
let network = null;

let inputs = ['X', 'Y','X2','Y2','XY','sX','sY'];
let layers = [4,2];


const NEGATIVE = "#FF0080";
const POSITIVE = "#00FF80";
const ZERO = "#e6e6e6";

// const socket = new WebSocket(URL);
// socket.onmessage = function(event){
//     todo обработка приходящих сообщений
// };


$(document).ready(function(){
    reloadDatasets();
    drawHeatMaps();
});

function connectAndSend(data, callback){
    $.ajax({
        url: URL,
        type: "get",
        async: true,
        data: {"Request": data},
        success: function (response) {
            console.log(response);
            if (callback === drawDataset)
                callback(response, data.split(' ')[2]);
        },
        error: function (response) {
            console.error(response);
            return response;
        }
    });
}

function reloadDatasets(){
    getDataset('circle');
    getDataset('xor');
    getDataset('spiral');
    getDataset('cluster');
}

function drawHeatMaps(){
    drawHeatMap('X', null);
    drawHeatMap('Y', null);
    drawHeatMap('X2', null);
    drawHeatMap('Y2', null);
    drawHeatMap('XY', null);
    drawHeatMap('sX', null);
    drawHeatMap('sY', null);
}

// todo прописать heatmap для нейрона
function drawHeatMap(id, neuron) {
    let canvas = document.getElementById(id+'-feature');
    let ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let grd;

    if (neuron === null){
        switch (id) {
            case 'X':
                ctx.beginPath();
                ctx.fillStyle = NEGATIVE;
                ctx.fillRect(0,0, width/4, height);

                grd = ctx.createLinearGradient(width/4 , 0, width*3/4, 0);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1,POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(width/4,0, width/2, height);

                ctx.fillStyle = POSITIVE;
                ctx.fillRect(width*3/4,0, width, height);
                ctx.stroke();
                return;

            case 'Y':
                ctx.beginPath();
                ctx.fillStyle = NEGATIVE;
                ctx.fillRect(0,height*3/4, width, height);
                ctx.stroke();

                grd = ctx.createLinearGradient(0, height*3/4, 0, height/4);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1,POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, width, height);

                ctx.fillStyle = POSITIVE;
                ctx.fillRect(0,0, width, height/4);
                ctx.stroke();
                return;

            case 'X2':
                ctx.beginPath();
                ctx.fillStyle = POSITIVE;
                ctx.fillRect(0,0, width/4, height);

                grd = ctx.createLinearGradient(width/4, 0, width*3/4, 0);
                grd.addColorStop(0, POSITIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1,POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(width/4,0, width*3/4, height);

                ctx.fillStyle = POSITIVE;
                ctx.fillRect(width*3/4,0, width, height);
                ctx.stroke();
                return;

            case 'Y2':
                ctx.beginPath();
                ctx.fillStyle = POSITIVE;
                ctx.fillRect(0,0, width, height/4);

                grd = ctx.createLinearGradient(0, height/4, 0, height*3/4);
                grd.addColorStop(0, POSITIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1,POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(0,height/4, width, height*3/4);

                ctx.fillStyle = POSITIVE;
                ctx.fillRect(0,height*3/4, width, height);
                ctx.stroke();
                return;

            case 'XY':
                // for (let i = -2; i < 2; i+=0.01){
                //     for (let j = 2; j > -2; j-=0.01){
                //         let x = scaleCoord(i, -2,2, width);
                //         let y = scaleCoord(j, -2,2, height);
                //         let pos;
                //         if (i*j < -1) pos = -0;
                //         else if (i*j > 1) pos = 1;
                //         else pos = i*j;
                //         if (pos > 0)
                //             ctx.fillStyle = colorToString(getColor(convertToInt(ZERO), convertToInt(POSITIVE), pos));
                //         else
                //             ctx.fillStyle = colorToString(getColor(convertToInt(ZERO), convertToInt(NEGATIVE), -pos));
                //         ctx.fillRect(x, y, 1,1);
                //
                //     }
                // }
                // ctx.stroke();
                ctx.fillStyle = NEGATIVE;
                ctx.fillRect(0,0,width/3, height/3);
                ctx.fillRect(width*2/3, height*2/3, width, height);

                ctx.fillStyle = POSITIVE;
                ctx.fillRect(0,height*2/3,width/3, height);
                ctx.fillRect(width*2/3, 0, width, height/3);

                grd = ctx.createLinearGradient(0, height/3, 0, height*2/3);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1, POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(0, height/3, width/3, height*2/3);

                grd = ctx.createLinearGradient(0, height/3, 0, height*2/3);
                grd.addColorStop(1, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(0, POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(width*2/3, height/3, width, height*2/3);

                grd = ctx.createLinearGradient(width/3, 0, width*2/3, 0);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1, POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(width/3, 0, width*2/3, height/3);

                grd = ctx.createLinearGradient(width/3, 0, width*2/3, 0);
                grd.addColorStop(1, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(0, POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(width/3, height*2/3, width*2/3, height);

                grd = ctx.createRadialGradient(width/3, height/3, 0, width/3, height/3, width/6);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(1, ZERO);
                ctx.fillStyle = grd;
                ctx.fillRect(width/3, height/3, width/6, height/6);

                grd = ctx.createRadialGradient(width*2/3, height*2/3, 0, width*2/3, height*2/3, width/6);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(1, ZERO);
                ctx.fillStyle = grd;
                ctx.fillRect(width/2, height/2, width/6, height/6);

                grd = ctx.createRadialGradient(width*2/3, height/3, 0, width*2/3, height/3, width/6);
                grd.addColorStop(0, POSITIVE);
                grd.addColorStop(1, ZERO);
                ctx.fillStyle = grd;
                ctx.fillRect(width/2, height/3, width/6, height/6);

                grd = ctx.createRadialGradient(width/3, height*2/3, 0, width/3, height*2/3, width/6);
                grd.addColorStop(0, POSITIVE);
                grd.addColorStop(1, ZERO);
                ctx.fillStyle = grd;
                ctx.fillRect(width/3, height/2, width/6, height/6);

                ctx.stroke();
                return;

            case 'sX':
                grd = ctx.createLinearGradient(0, 0, width*0.11, 0);
                grd.addColorStop(0, colorToString(getColor(convertToInt(ZERO), convertToInt(NEGATIVE), 0.78)));
                grd.addColorStop(1, NEGATIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, width*0.11, height);

                grd = ctx.createLinearGradient(width*0.11, 0, width*0.89, 0);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1,POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(width*0.11, 0, width*0.89,height);

                grd = ctx.createLinearGradient(width*0.89, 0, width, 0);
                grd.addColorStop(0, colorToString(getColor(convertToInt(POSITIVE), convertToInt(ZERO), 0.78)));
                grd.addColorStop(1, ZERO);
                ctx.fillStyle = grd;
                ctx.fillRect(width*0.89,0, width, height);
                ctx.stroke();
                return;

            case 'sY':
                grd = ctx.createLinearGradient(0, 0, 0, height*0.11, );
                grd.addColorStop(0, colorToString(getColor(convertToInt(ZERO), convertToInt(NEGATIVE), 0.78)));
                grd.addColorStop(1, NEGATIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, width, height*0.11);

                grd = ctx.createLinearGradient(0, height*0.11, 0, height*0.89);
                grd.addColorStop(0, NEGATIVE);
                grd.addColorStop(0.5, ZERO);
                grd.addColorStop(1,POSITIVE);
                ctx.fillStyle = grd;
                ctx.fillRect(0, height*0.11, width,height*0.89);

                grd = ctx.createLinearGradient(0, height*0.89, 0, height);
                grd.addColorStop(0, colorToString(getColor(convertToInt(POSITIVE), convertToInt(ZERO), 0.78)));
                grd.addColorStop(1, ZERO);
                ctx.fillStyle = grd;
                ctx.fillRect(0, height*0.89, width, height);
                ctx.stroke();
                return;
        }
    }
}

function startStop(){
    if (network !== null){
        if (!isLearning)
            sendStartFit();
        else
            sendStopFit();
        isLearning = !isLearning;
    }
    else{
        sendReset();
    }

}

//todo прописать автоматическое обновление сети
function sendStartFit() {
    connectAndSend("train forever");
}

function sendStopFit(){
    connectAndSend('train stop');
}

function doStep(){
    timerIndex++;
    connectAndSend('train once', );
}

function sendReset() {
    let request = "update network";
    let params = grabData();
    for (let i = 0; i < params.length; i++) {
        request += " " + params[i];
    }
    let error = connectAndSend(request, createNetwork);
    if (error){} //todo прописать вывод ошибки
    timerIndex = 0;
}

function createNetwork(data){
    if (data.startsWith('MLP'))
        network = new Mlp(data);

    else if (data.startsWith("RBF"))
        network = new Rbf(data);
}

function grabData() {
    let shape = layers.join(',');
    let s_inputs = inputs.join(',');
    let net_type = document.getElementById("NNtype").value;
    let learn_rate = document.getElementById("myLearningRate").value;
    if (net_type === 'mlp') {
        let activation = document.getElementById("myActivations").value;
        let regularization = document.getElementById("myRegularizations").value;
        let regularizationRate = document.getElementById("myRegularizationRate").value;
        return [net_type, shape, activation, learn_rate, regularizationRate, regularization, s_inputs];
    }
    else{ //net_type == 'rbf'
        return [net_type, learn_rate]
    }
}

function getDataset(type){
    let response = connectAndSend('get_points 400 ' + type, drawDataset);
    if (response) {
        console.error(response);
    }
}

function drawDataset(response, id){
    let points = [];
    response.split('\n').forEach(function(item){
        let params = item.split(', ');
        points.push(new Point(Number(params[0]), Number(params[1]), params[2]));
    });

    points = points.slice(0,399);
    let canvas = document.getElementById(id+'-dataset');
    let ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const maxX = Math.max.apply(Math, points.map(function(o){return o.x})) - width*0.05;
    const minX = Math.min.apply(Math, points.map(function(o){return o.x})) + height*0.05;
    const maxY = Math.max.apply(Math, points.map(function(o){return o.y})) - width*0.05;
    const minY = Math.min.apply(Math, points.map(function(o){return o.y})) + height*0.05;

    ctx.clearRect(0,0, width, height);

    points.forEach(function(point){
        scale(point, minX, minY, maxX, maxY, width, height)
    });

    const CIRCLE_SIZE = 10;

    for (let i = 0; i < points.length; i++){
        let point = points[i];
        if (point.val === '1')
            ctx.fillStyle = "#ff0066";
        else if (point.val === '0')
            ctx.fillStyle = "#e8eaeb";
        else
            ctx.fillStyle = "#00ff80";

        ctx.beginPath();
        ctx.fillRect(point.x-CIRCLE_SIZE/2, point.y-CIRCLE_SIZE/2, CIRCLE_SIZE, CIRCLE_SIZE);
        ctx.stroke();
        console.log("drawn point ", point.x, point.y);
    }

}

function selectDataset(type){
    let sets = [document.getElementById("circle-dataset"),
        document.getElementById("cluster-dataset"),
        document.getElementById("xor-dataset"),
        document.getElementById("spiral-dataset")];
    sets.forEach(function(item){
        item.style.opacity = '0.2';
    });
    switch (type) {
        case 'circle':
            sets[0].style.opacity = '1';
            break;
        case 'cluster':
            sets[1].style.opacity = '1';
            break;
        case 'xor':
            sets[2].style.opacity = '1';
            break;
        case 'spiral':
            sets[3].style.opacity = '1';
            break;
    }
}

function selectFeature(id){
    let name = id.substr(0, id.length-8);
    let parent = document.getElementById(id).parentElement;
    if (!inputs.includes(name)){ //add
        inputs.push(name);
        parent.style.opacity = '1';
    }
    else{
        inputs = inputs.filter(function (value, index, arr) { //remove
            return arr[index] !== name;
        });
        parent.style.opacity = '0.3';
    }
}

function addLayer(){
    if (layers.length < 9){
        layers.push(2);
        addRow((layers.length-1).toString());
        updateNet();
    }
}

function addRow(rowNum){
    let rowId = 'row-'+rowNum.toString();
    let parent = document.getElementById('columns');
    let newCol = document.createElement('div');
    parent.appendChild(newCol);
    newCol.setAttribute('class', 'layer-column');
    newCol.setAttribute('id', rowId);

    let buttons = document.createElement('div');
    newCol.appendChild(buttons);
    buttons.setAttribute('class', 'neuron-buttons');

    let addButton = document.createElement('button');
    buttons.appendChild(addButton);
    addButton.setAttribute('class', 'mdl-button mdl-js-button mdl-button--icon layers-button');
    addButton.setAttribute('id', 'add-'+rowNum);
    addButton.setAttribute('onclick', `addNextNeuron('${rowId}')`);
    let add = document.createElement('i');
    addButton.appendChild(add);
    add.setAttribute('class', 'material-icons');
    add.innerText='add';


    let removeButton = document.createElement('button');
    buttons.appendChild(removeButton);
    removeButton.setAttribute('class', 'mdl-button mdl-js-button mdl-button--icon layers-button');
    removeButton.setAttribute('id', 'remove-'+rowNum);
    removeButton.setAttribute('onclick', `removeNeuron('${rowId}')`);
    let remove = document.createElement('i');
    remove.setAttribute('class', 'material-icons');
    removeButton.appendChild(remove);
    remove.innerText='remove';

    for (let i = 0; i < layers[rowNum]; i++)
        addNeuron(rowNum+'0'+i);
}

function removeLayer(){
    if (layers.length > 0){
        layers.pop();
        removeRow(layers.length.toString());
        updateNet();
    }
}

function removeRow(rowNum) {
    let rowId = 'row-'+rowNum.toString();
    document.getElementById(rowId).parentNode.removeChild(document.getElementById(rowId));
}

function updateNet() {
    document.getElementById('num-layers').innerText = layers.length.toString();
    let collection = document.getElementsByClassName('layer-column');
    let width = ((99-layers.length)/layers.length).toString();
    for (let i = 0; i < collection.length; i++)
        collection[i].setAttribute('style', 'width: '+width+'%');
}

function addNeuron(sNeuronId){
    let rowId = Math.floor(parseInt(sNeuronId)/100);
    let parent = document.getElementById('row-'+rowId);
    let neuron = document.createElement('div');
    neuron.setAttribute('id', sNeuronId);
    neuron.setAttribute('class', 'neuron');
    parent.appendChild(neuron);
}

function addNextNeuron(rowId){
    let row = document.getElementById(rowId);
    let rowNum = parseInt(rowId.substr(4));
    let children = row.querySelectorAll("div.neuron");
    addNeuron(rowNum+'0'+children.length);
    layers[rowNum]++;
}

function removeNeuron(rowId) {
    let row = document.getElementById(rowId);
    let rowNum = parseInt(rowId.substr(4));
    let children = row.querySelectorAll("div.neuron");
    if (children.length > 1){
        let child = document.getElementById(rowNum+'0'+(layers[rowNum]-1));
        child.parentNode.removeChild(child);
        layers[rowNum]--;
    }
}

function changeNnTo(networkType){
    if (networkType === 'rbf'){
        let child = document.getElementById('features-column');
        child.parentNode.removeChild(child);

        child = document.getElementById('hidden-layers-column');
        child.parentNode.removeChild(child);

    }
}