class NodeRBF {
    constructor(id, weight, wx, wy) {
        this.id = id;
        this.weight = weight;
        this.wx = wx;
        this.wy = wy;
    }
}

/**
 * Десереализация
 * @param Узлы от сервера responseNodesRBF 
 */
function buildNetworkRBF(responseNodesRBF) {
  //let newNodePos;
  //let newNode = responseNodesRBF//responseNodesRBF[responseNodesRBF.length - 1];

  for (i = 0; i < networkRBF.length; i++) {
    if (networkRBF[i].wx == responseNodesRBF.wx && networkRBF[i].wy == responseNodesRBF.wy) {
        networkRBF[i].weight += responseNodesRBF.weight;
        trainDataRBF[i].weight += responseNodesRBF.weight;
        return i;
    }
  }
  // Если это уникальный узел
  networkRBF.push(new NodeRBF(
      responseNodesRBF.id,
      responseNodesRBF.weight,
      responseNodesRBF.wx,
      responseNodesRBF.wy));

  trainDataRBF.push({
      x:      responseNodesRBF.wx,
      y:      responseNodesRBF.wy,
      label:  responseNodesRBF.weight
  });

  return networkRBF.length - 1;
// Пинок под зад для ускорения
//  for (let i = networkRBF.length - 1; i < responseNodesRBF.length; i++) {
//
//    // Это работает, пробую 1 вещь сделать
//    networkRBF[i] = new NodeRBF(
//      responseNodesRBF[i].id,
//      responseNodesRBF[i].weight,
//      responseNodesRBF[i].wx,
//      responseNodesRBF[i].wy);
//
//    trainDataRBF[i] = {
//        x:      responseNodesRBF[i].wx,
//        y:      responseNodesRBF[i].wy,
//        label:  responseNodesRBF[i].weight
//    };
//  }
}

class StateRBF {
  constructor() {
    this.sigma = 0.5;
    this.radius = 3; this.showTestData = false;  this.noise = 0;
    this.discretize = false; this.problem = Problem.CLASSIFICATION;  this.percTrainData = 50;
    this.activation = Activations.SIGMOID;
    this.dataset = classifyCircleData; this.regDataset = regressPlane; }
//  serialize() {
//    let _this = this;
//    let props = [];
//    StateRBF.PROPS.forEach(function (_a) {
//      let name = _a.name, type = _a.type, keyMap = _a.keyMap;
//      let value = _this[name];
//      if (value == null) {
//        return;
//      }
//      if (type === Type.OBJECT) {
//        value = getKeyFromValue(keyMap, value);
//      }
//      else if (type === Type.ARRAY_NUMBER ||
//        type === Type.ARRAY_STRING) {
//        value = value.join(",");
//      }
//      props.push(name + "=" + value);
//    });
//    getHideProps(this).forEach(function (prop) {
//      props.push(prop + "=" + _this[prop]);
//    });
//    window.location.hash = props.join("&");
//  }
  getHiddenProps() {
    let result = [];
    for (let prop in this) {
      if (endsWith(prop, HIDE_STATE_SUFFIX) && String(this[prop]) === "true") {
        result.push(prop.replace(HIDE_STATE_SUFFIX, ""));
      }
    }
    return result;
  }
  setHideProperty(name, hidden) {
    this[name + HIDE_STATE_SUFFIX] = hidden;
  }
//  static deserializeState() {
//    let map = {};
//    for (let _i = 0, _a = window.location.hash.slice(1).split("&"); _i < _a.length; _i++) {
//      let keyvalue = _a[_i];
//      let _b = keyvalue.split("="), name_1 = _b[0], value = _b[1];
//      map[name_1] = value;
//    }
//    let stateRBF = new StateRBF();
//    function hasKey(name) {
//      return name in map && map[name] != null && map[name].trim() !== "";
//    }
//    function parseArray(value) {
//      return value.trim() === "" ? [] : value.split(",");
//    }
//    StateRBF.PROPS.forEach(function (_a) {
//      let name = _a.name, type = _a.type, keyMap = _a.keyMap;
//      switch (type) {
//        case Type.OBJECT:
//          if (keyMap == null) {
//            throw Error("A key-value map must be provided for state " +
//              "variables of type Object");
//          }
//          if (hasKey(name) && map[name] in keyMap) {
//            stateRBF[name] = keyMap[map[name]];
//          }
//          break;
//        case Type.NUMBER:
//          if (hasKey(name)) {
//            stateRBF[name] = +map[name];
//          }
//          break;
//        case Type.STRING:
//          if (hasKey(name)) {
//            stateRBF[name] = map[name];
//          }
//          break;
//        case Type.BOOLEAN:
//          if (hasKey(name)) {
//            stateRBF[name] = (map[name] === "false" ? false : true);
//          }
//          break;
//        case Type.ARRAY_NUMBER:
//          if (name in map) {
//            stateRBF[name] = parseArray(map[name]).map(Number);
//          }
//          break;
//        case Type.ARRAY_STRING:
//          if (name in map) {
//            stateRBF[name] = parseArray(map[name]);
//          }
//          break;
//        default:
//          throw Error("Encountered an unknown type for a state variable");
//      }
//    });
//    getHideProps(map).forEach(function (prop) {
//      stateRBF[prop] = (map[prop] === "true") ? true : false;
//    });
//
//    if (stateRBF.seed == null) {
//      stateRBF.seed = Math.random().toFixed(5);
//    }
//    Math.seedrandom(stateRBF.seed);
//    return stateRBF;
//  }
}
StateRBF.PROPS = [
    { name: "activation", type: Type.OBJECT, keyMap: activations },
    { name: "dataset", type: Type.OBJECT, keyMap: datasets },
    { name: "regDataset", type: Type.OBJECT, keyMap: datasets.regDatasets },
    { name: "noise", type: Type.NUMBER },
    { name: "seed", type: Type.STRING },
    { name: "showTestData", type: Type.BOOLEAN },
    { name: "discretize", type: Type.BOOLEAN },
    { name: "percTrainData", type: Type.NUMBER },
    { name: "collectStats", type: Type.BOOLEAN },
    { name: "problem", type: Type.OBJECT, keyMap: problems },
];

let NUM_SAMPLES_CLASSIFY_RBF = 500*4;
let NUM_SAMPLES_REGRESS_RBF = 1200*4;
let DENSITY_RBF = 100*4;

let HIDABLE_CONTROLS_RBF = [
    ["Discretize output", "discretize"],
    ["Play button", "playButton"],
    ["Step button", "stepButton"],
    ["Reset button", "resetButton"],
    ["Learning rate", "learningRate"],
    ["Regularization rate", "regularizationRate"],
    ["Problem type", "problem"],
    ["Which dataset", "dataset"],
    ["Ratio train data", "percTrainData"],
    ["Noise level", "noise"],
];

class PlayerRBF {
  constructor() {
      this.timerIndex = 0;
      this.isPlaying = false;
      this.callback = null;
  }
  playOrPause() {
      if (this.isPlaying) {
          this.isPlaying = false;
          this.pause();
      }
      else {
          this.isPlaying = true;
          this.play();
      }
  }
  onPlayPause(callback) {
      this.callback = callback;
  }
  play() {
      this.pause();
      this.isPlaying = true;
      if (this.callback) {
          this.callback(this.isPlaying);
      }
      this.start(this.timerIndex);
  }
  pause() {
      this.timerIndex++;
      this.isPlaying = false;
      if (this.callback) {
          this.callback(this.isPlaying);
      }
  }
  start(localTimerIndex) {
      let _this = this;
      d3.timer(function () {
          if (localTimerIndex < _this.timerIndex) {
              return true;
          }
          oneStepRBF();
          return false;
      }, 0);
  }
}


//let stateRBF = StateRBF.deserializeState();
let stateRBF = new StateRBF();

let boundaryRBF = new Array(DENSITY_RBF);
for (i = 0; i < DENSITY_RBF; i++) {
    boundaryRBF[i] = new Array(DENSITY_RBF);
    for (j = 0; j < DENSITY_RBF; j++) {
       boundaryRBF[i][j] = 0;
    }
}

let boundaryOutRBF = new Array(DENSITY_RBF);
let xDomainRBF = [-6, 6];
let heatMapRBF = new HeatMap(600, DENSITY_RBF, xDomainRBF, xDomainRBF, d3.select("#heatmap-RBF"), { showAxes: true });
let heatMapOutRBF = new HeatMap(600, DENSITY_RBF, xDomainRBF, xDomainRBF, d3.select("#heatmap-out-RBF"), { showAxes: true });
let linkWidthScaleRBF = d3.scale.linear()
    .domain([0, 5])
    .range([1, 10])
    .clamp(true);

let iterRBF = 0;
let trainDataRBF = [];
let testDataRBF = [];
let networkRBF = [];
let playerRBF = new PlayerRBF();


function makeGUIRBF() {
    d3.select("#reset-button-RBF").on("click", function () {
        resetRBF();
        d3.select("#play-pause-button-RBF");
    });
    d3.select("#play-pause-button-RBF").on("click", function () {
        playerRBF.playOrPause();
    });
    playerRBF.onPlayPause(function (isPlaying) {
        d3.select("#play-pause-button-RBF").classed("playing", isPlaying);
    });
    d3.select("#next-step-button-RBF").on("click", function () {
        playerRBF.pause();
        oneStepRBF();
    });
    d3.select("#data-regen-button-RBF").on("click", function () {
        generateDataRBF();
        resetRBF();
    });
    let dataThumbnails = d3.selectAll("canvas[data-dataset-RBF]");
    dataThumbnails.on("click", function () {
        let newDataset = datasets[this.dataset.datasetRbf];
        if (newDataset === stateRBF.dataset) {
            return;
        }
        stateRBF.dataset = newDataset;
        nullify();
        dataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateDataRBF();
        resetRBF();
    });
    let datasetKey = getKeyFromValue(datasets, state.dataset);
    d3.select("canvas[data-dataset-RBF=" + datasetKey + "]")
        .classed("selected", true);
    let regDataThumbnails = d3.selectAll("canvas[data-regDataset-RBF]");
    regDataThumbnails.on("click", function () {
        let newDataset = datasets.regDatasets[this.dataset.regdatasetRbf];
        if (newDataset === stateRBF.regDataset) {
            return;
        }
        stateRBF.regDataset = newDataset;
        regDataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateDataRBF();
        resetRBF();
    });
    let regDatasetKey = getKeyFromValue(datasets.regDatasets, stateRBF.regDataset);
    d3.select("canvas[data-regDataset-RBF=" + regDatasetKey + "]")
        .classed("selected", true);

  let percTrain = d3.select("#percTrainData-RBF").on("input", function () {
      stateRBF.percTrainData = this.value;
      d3.select("label[for='percTrainData'] .value#RBF").text(this.value);
      generateDataRBF();
      resetRBF();
  });
  percTrain.property("value", stateRBF.percTrainData);
  d3.select("label[for='percTrainData'] .value#RBF").text(stateRBF.percTrainData);
    let noise = d3.select("#noise-RBF").on("input", function () {
      d3.select("label[for='noise'] .value#RBF").text(this.value);
      generateDataRBF();
      resetRBF();
    });

    let currentMax = parseInt(noise.property("max"));
    if (stateRBF.noise > currentMax) {
        if (stateRBF.noise <= 80) { noise.property("max", stateRBF.noise);}
        else { stateRBF.noise = 50; }
    }
    else if (stateRBF.noise < 0) {
        stateRBF.noise = 0;
    }
    noise.property("value", stateRBF.noise);
    d3.select("label[for='noise'] .value#RBF").text(stateRBF.noise);

    let radius = d3.select("#radius-RBF").on("input", function () {
      stateRBF.radius = this.value;
      d3.select("label[for='radius'] .value#RBF").text((+this.value).toFixed(2));
      resetRBF();
    });
    radius.property("value", stateRBF.radius);
    d3.select("label[for='radius'] .value#RBF").text(stateRBF.radius.toFixed(2));

    let sigma = d3.select("#sigma-RBF").on("input", function () {
      stateRBF.sigma = this.value;
      d3.select("label[for='sigma'] .value#RBF").text((+this.value).toFixed(2));
      resetRBF();
    });
    sigma.property("value", stateRBF.sigma);
    d3.select("label[for='sigma'] .value#RBF").text(stateRBF.sigma.toFixed(2));

    let problem = d3.select("#problem-RBF").on("change", function () {
        stateRBF.problem = problems[this.value];
        generateDataRBF();
        drawDatasetThumbnailsRBF();
        resetRBF();
    });
    problem.property("value", getKeyFromValue(problems, stateRBF.problem));

    let x = d3.scale.linear().domain([-1, 1]).range([0, 144]);
    let xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues([-1, 0, 1])
        .tickFormat(d3.format("d"));
    d3.select("#colormap-RBF g.core").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,10)")
        .call(xAxis);

    window.addEventListener("resize", function () {
      let newWidth  = document.querySelector("#main-part").getBoundingClientRect().width; 

      if (newWidth !== mainWidth) {
          mainWidth = newWidth;
          drawNetworkRBF();
          updateDecisionBoundaryRBF();
          updateUIRBF(); // Тут не должно быть запроса.
      }
    });
}

function nullify() {
    networkRBF = [];
    trainDataRBF = [];
    for (i = 0; i < DENSITY_RBF; i++) {
        boundaryRBF[i] = new Array(DENSITY_RBF);
        for (j = 0; j < DENSITY_RBF; j++) {
           boundaryRBF[i][j] = 0;
        }
    }
    boundaryOutRBF = [];
    heatMapRBF.updateTestPoints(trainDataRBF);
    heatMapRBF.updateBackground(boundaryRBF, false);
}

function updateDecisionBoundaryRBF() {
  function outRBF(node, point) {
    return node.weight
    * Math.exp( -stateRBF.sigma/ 
      Math.sqrt(
        Math.pow(point.x - node.wx, 2) + Math.pow(point.y - node.wy,2))) 
    / stateRBF.sigma;
  }
  let xScale = d3.scale.linear().domain([0, DENSITY_RBF - 1]).range(xDomainRBF);
  let yScale = d3.scale.linear().domain([DENSITY_RBF - 1, 0]).range(xDomainRBF);
  let i = 0, j = 0, x, y;
  
  for (i = 0; i < DENSITY_RBF; i++) {
    boundaryOutRBF[i] = new Array(DENSITY_RBF);   
    for (j = 0; j < DENSITY_RBF; j++) {
      x = xScale(i);
      y = yScale(j);
      
      boundaryOutRBF[i][j] = 0;
      for (const node of networkRBF) {
        boundaryOutRBF[i][j] += outRBF(node, {x: x, y: y});
      }
    }
  }
  heatMapOutRBF.updateBackground(boundaryOutRBF, false);
}

function updateUIRBF(reqType = "") {
    if (reqType == "ResetInit") {
        requestRBF_RESET();
        requestRBF_INIT();
    }
    else if (reqType == "Train") {
        requestRBF_TRAIN();
    }

    //drawNetworkRBF();
    //updateDecisionBoundaryRBF();
}

function oneStepRBF() {
    d3.select("#iter-number-RBF").text((iterRBF / 1000).toFixed(3));
    //iterRBF++;    d3.select("#iter-number-RBF").text((iterRBF / 1000).toFixed(3));
    updateUIRBF("Train"); // Тут точно нужен Train.
}
function drawNetworkRBF(newNodePos = networkRBF.length - 1) {
  if (networkRBF[0] === undefined) return;

  /**
   * Формула для вычисления производной сигмоиды для рисования на canvas, 
   * придуманная великим и самым охуительным математиком  - Виталием Поповым
   * @param x в формуле 
   * @param r это надуманный параметр для радиуса
   * @param weight сила связи, в данном случае высота  
   * @param bright надуманный параметр яркости
   */
  function sigmoidDerr(x, r, weight, bright) { 
    return Math.exp(-x*r)/Math.pow(1+Math.exp(-x*r), 2) * weight * bright;
  }

  let xScale = d3.scale.linear().domain([0, DENSITY_RBF - 1]).range(xDomainRBF);
  let yScale = d3.scale.linear().domain([DENSITY_RBF - 1, 0]).range(xDomainRBF);
  let i = 0, j = 0, x, y, distance;
  let newNode = networkRBF[newNodePos];

  for (i = 0; i < DENSITY_RBF; i++) {
    for (j = 0; j < DENSITY_RBF; j++) {
      x = xScale(i);
      y = yScale(j);

      distance = dist({x: newNode.wx, y: newNode.wy}, {x: x, y: y});
      if (distance < stateRBF.radius) {
        boundaryRBF[i][j] += Math.exp(-distance*5)/Math.pow(1+Math.exp(-distance*5), 2) * newNode.weight * 8//sigmoidDerr(distance, 5, newNode.weight, 8);
      }
    }
  }
  iterRBF++;
  d3.select("#iter-number-RBF").text((iterRBF / 1000).toFixed(3));
  heatMapRBF.updateTestPoints(trainDataRBF);
  heatMapRBF.updateBackground(boundaryRBF, false);
}

function resetRBF() {
    nullify();
    //stateRBF.serialize();
    playerRBF.pause();
    iterRBF = 0;
    d3.select("#iter-number-RBF").text((iterRBF / 1000).toFixed(3));
    updateUIRBF("ResetInit");// А тут reset, если есть currentId_RBF, а затем init
    drawNetworkRBF();
    updateDecisionBoundaryRBF();
}

function drawDatasetThumbnailsRBF() {
    function renderThumbnail(canvas, dataGenerator) {
        let w = 100;
        let h = 100;
        try {
          canvas.setAttribute("width", w);
          canvas.setAttribute("height", h);
        } catch (error) {return}
        let context = canvas.getContext("2d");
        let data = dataGenerator(200, 0);
        data.forEach(function (d) {
            context.fillStyle = colorScale(d.label);
            context.fillRect(w * (d.x + 6) / 12, h * (d.y + 6) / 12, 4, 4);
        });
        d3.select(canvas.parentNode).style("display", null);
    }
    d3.selectAll(".datasetRBF").style("display", "none");
    if (stateRBF.problem === Problem.CLASSIFICATION) {
        for (let dataset in datasets) {
            let canvas = document.querySelector("canvas[data-dataset-rbf=" + dataset + "]");
            let dataGenerator = datasets[dataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
    if (stateRBF.problem === Problem.REGRESSION) {
        for (let regDataset in datasets.regDatasets) {
            let canvas = document.querySelector("canvas[data-regDataset-rbf=" + regDataset + "]");
            let dataGenerator = datasets.regDatasets[regDataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
}

function generateDataRBF(firstTime) { if (firstTime === void 0) { firstTime = false; }
    if (!firstTime) {
        stateRBF.seed = Math.random().toFixed(5);
        //stateRBF.serialize();
    }
    Math.seedrandom(stateRBF.seed);
    let numSamples = (stateRBF.problem === Problem.REGRESSION) ?
        NUM_SAMPLES_REGRESS : NUM_SAMPLES_CLASSIFY;
    
    let generator = stateRBF.problem === Problem.CLASSIFICATION ?
        stateRBF.dataset : stateRBF.regDataset;

    let data = generator(numSamples, stateRBF.noise / 100);
    shuffle(data);
    let splitIndex = Math.floor(data.length * stateRBF.percTrainData / 100);
    //trainDataRBF = data.slice(0, splitIndex);
    testDataRBF = data.slice(splitIndex);
}

let currentId_RBF = -1;

drawDatasetThumbnailsRBF();
makeGUIRBF();
resetRBF();


async function requestRBF_INIT() {

    stateRBF.datasetName = stateRBF.dataset.name;
    // НЕ ЗАБЫТЬ ПОМЕНЯТЬ ACTIVATION
    stateRBF.activation = stateRBF.activation.toString();
    //console.log(JSON.stringify(stateRBF))
    // Тело для разных запросов
    let reqBodyRBF = '{"sigma":0.5,"radius":1.5,"showTestData":false,"noise":0,"discretize":false,"problem":0,"percTrainData":50,"activation":"identity","seed":"0.40979","collectStats":false, "datasetName":"classifyCircleData"}'

    let response = await fetch("http://localhost:8080/init", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateRBF)
    });

//    console.group('INIT RBF');
//    console.log('response  ',response);
//    console.groupEnd();

    // Нужно запомнить ID
    currentId_RBF = response.statusText.split('\\n')[1].slice(0, -1);
}

async function requestRBF_TRAIN() {

    // НЕ ЗАБЫТЬ ПОМЕНЯТЬ ACTIVATION
    //let reqBodyRBF = '{"id": 0, "datasetName": "classifyCircleData"}'
    let reqBodyRBF = `{"id": ${currentId_RBF}, "datasetName": "${stateRBF.datasetName}"}`;
    //console.log(reqBodyRBF);
    let response = await fetch("http://localhost:8080/get_values", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: reqBodyRBF
    });

//    console.group('TRAIN RBF');
//    console.log('response  ', JSON.parse(response.statusText.slice(2, -1)).last_node);
//    console.groupEnd();

    // Новые данные получены, нужно их десереализовать, отрисовать и вызвать алгоритм заново
    // Впрочем нужно определиться только с местом десереализации, ведь остальное будет сделано
    // в updateUIRBF
    let newNodePos = buildNetworkRBF(JSON.parse(response.statusText.slice(2, -1)).last_node);
    // Вызывать тут отрисовку нейронов
    drawNetworkRBF(newNodePos);
    updateDecisionBoundaryRBF();
}

async function requestRBF_RESET() {
    if (currentId_RBF == -1) return;
//    console.group('RESET RBF');
//    let reqBodyRBF = '{"id": 0}'
    let reqBodyRBF = `{"id": ${currentId_RBF}}`;
//    console.log(reqBodyRBF);

    let response = await fetch("http://localhost:8080/reset", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: reqBodyRBF
    });


//    console.log('response  ',response);
//    console.groupEnd();
    // Обнуляем ID
    currentId_RBF = -1;
}
