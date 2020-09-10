const initNetworkURL  = 'localhost:8080/init';
const trainNetworkURL = 'localhost:8080/get_values';
const resetNetworkURL = 'localhost:8080/reset';

async function requestInit() {

    // stateRBF.datasetName = stateRBF.dataset.name 
    // console.log(JSON.stringify(stateRBF));
//    console.log(state.networkShape);
//    console.log(state.numHiddenLayers);

    // Тело для разных запросов
    //let reqBodyMLP = '{"learningRate":0.03,"regularizationRate":0,"showTestData":false,"noise":0,"batchSize":10,"discretize":false,"tutorial":null,"percTrainData":50,"activation":{},"regularization":null,"problem":0,"initZero":false,"hideText":false,"collectStats":false,"numHiddenLayers":2,"hiddenLayerControls":[],"networkShape":[4,2],"x":true,"y":true,"xTimesY":false,"xSquared":false,"ySquared":false,"cosX":false,"sinX":false,"cosY":false,"sinY":false,"seed":"0.40979","datasetName":"classifyCircleData"}';
    //let reqBodyRBF = '{"sigma":0.5,"radius":1.5,"showTestData":false,"noise":0,"discretize":false,"problem":0,"percTrainData":50,"activation":{},"seed":"0.40979","collectStats":false, "datasetName":"classifyCircleData"}'
    // НЕ ЗАБЫТЬ ПОМЕНЯТЬ ACTIVATION
    let reqBodyMLP = '{"learningRate":0.03,"regularizationRate":0,"showTestData":false,"noise":0,"batchSize":10,"discretize":false,"tutorial":null,"percTrainData":50,"activation":"identity","regularization":null,"problem":0,"initZero":false,"hideText":false,"collectStats":false,"numHiddenLayers":2,"hiddenLayerControls":[],"networkShape":[4,2],"x":true,"y":true,"xTimesY":false,"xSquared":false,"ySquared":false,"cosX":false,"sinX":false,"cosY":false,"sinY":false,"seed":"0.40979","datasetName":"classifyCircleData"}';
    let reqBodyRBF = '{"sigma":0.5,"radius":1.5,"showTestData":false,"noise":0,"discretize":false,"problem":0,"percTrainData":50,"activation":"identity","seed":"0.40979","collectStats":false, "datasetName":"classifyCircleData"}'

    let response = await fetch("http://" + initNetworkURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: reqBodyMLP
    });

    console.group('AnswerINIT');
    console.log('response  ',response);
    console.groupEnd();
}

async function requestTrain() {

    // НЕ ЗАБЫТЬ ПОМЕНЯТЬ ACTIVATION
    let reqBodyMLP = '{"id": 0, "datasetName": "classifyCircleData"}';
    let reqBodyRBF = '{"id": 0, "datasetName": "classifyCircleData"}'

    let response = await fetch("http://" + trainNetworkURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: reqBodyMLP
    });

    console.group('AnswerTRAIN');
    console.log('response  ',response);
    console.groupEnd();
}

async function requestReset() {

     // НЕ ЗАБЫТЬ ПОМЕНЯТЬ ACTIVATION
    let reqBodyMLP = '{"id": 0}';
    let reqBodyRBF = '{"id": 0}'

    let response = await fetch("http://" + resetNetworkURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: reqBodyMLP
    });

    console.group('AnswerRESET');
    console.log('response  ',response);
    console.groupEnd();
}

// Вызываем здесь функцию для того, чтобы тестировать запросы
//request()