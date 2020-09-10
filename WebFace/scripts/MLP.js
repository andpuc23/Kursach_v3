let exports = {};

function shuffle(array) {
    let counter = array.length;
    let temp = 0;
    let index = 0;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
function classifyTwoGaussData(numSamples, noise) {
    let points = [];
    let varianceScale = d3.scale.linear().domain([0, .5]).range([0.5, 4]);
    let variance = varianceScale(noise);
    function genGauss(cx, cy, label) {
        for (let i = 0; i < numSamples / 2; i++) {
            let x = normalRandom(cx, variance);
            let y = normalRandom(cy, variance);
            points.push({ x: x, y: y, label: label });
        }
    }
    // Нужно подстроиться под  и MLP, но лучше сперва написать Андрею об этом.
    genGauss(2, 2, 1);
    genGauss(-2, -2, -1);
    return points;
}
function regressPlane(numSamples, noise) {
    let radius = 6;
    let labelScale = d3.scale.linear()
        .domain([-10, 10])
        .range([-1, 1]);
    let getLabel = function (x, y) { return labelScale(x + y); };
    let points = [];
    for (let i = 0; i < numSamples; i++) {
        let x = randUniform(-radius, radius);
        let y = randUniform(-radius, radius);
        let noiseX = randUniform(-radius, radius) * noise;
        let noiseY = randUniform(-radius, radius) * noise;
        let label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
function regressGaussian(numSamples, noise) {
    let points = [];
    let labelScale = d3.scale.linear()
        .domain([0, 2])
        .range([1, 0])
        .clamp(true);
    let gaussians = [
        [-4, 2.5, 1],
        [0, 2.5, -1],
        [4, 2.5, 1],
        [-4, -2.5, -1],
        [0, -2.5, 1],
        [4, -2.5, -1]
    ];
    function getLabel(x, y) {
        let label = 0;
        gaussians.forEach(function (_a) {
            let cx = _a[0], cy = _a[1], sign = _a[2];
            let newLabel = sign * labelScale(dist({ x: x, y: y }, { x: cx, y: cy }));
            if (Math.abs(newLabel) > Math.abs(label)) {
                label = newLabel;
            }
        });
        return label;
    }
    let radius = 6;
    for (let i = 0; i < numSamples; i++) {
        let x = randUniform(-radius, radius);
        let y = randUniform(-radius, radius);
        let noiseX = randUniform(-radius, radius) * noise;
        let noiseY = randUniform(-radius, radius) * noise;
        let label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    ;
    return points;
}
function classifySpiralData(numSamples, noise) {
    let points = [];
    let n = numSamples / 2;
    function genSpiral(deltaT, label) {
        for (let i = 0; i < n; i++) {
            let r = i / n * 5;
            let t = 1.75 * i / n * 2 * Math.PI + deltaT;
            // let x = r * Math.sin(t) + randUniform(-1, 1) * noise;
            // let y = r * Math.cos(t) + randUniform(-1, 1) * noise; 
            let x = r * Math.sin(t) + randUniform(-6, 6) * noise;
            let y = r * Math.cos(t) + randUniform(-6, 6) * noise;
            points.push({ x: x, y: y, label: label });
        }
    }
    genSpiral(0, 1);
    genSpiral(Math.PI, -1);
    return points;
}
function classifyCircleData(numSamples, noise) {
    let points = [];
    let radius = 6;//5
    function getCircleLabel(p, center) {
        return (dist(p, center) < (radius * 0.5)) ? 1 : -1;
    }
    for (let i = 0; i < numSamples / 2; i++) {
        let r = randUniform(0, radius * 0.5);
        let angle = randUniform(0, 2 * Math.PI);
        let x = r * Math.sin(angle);
        let y = r * Math.cos(angle);
        let noiseX = randUniform(-radius, radius) * noise;
        let noiseY = randUniform(-radius, radius) * noise;
        let label = getCircleLabel({ x: x + noiseX, y: y + noiseY }, { x: 0, y: 0 });
        points.push({ x: x, y: y, label: label });
    }
    for (let i = 0; i < numSamples / 2; i++) {
        let r = randUniform(radius * 0.7, radius);
        let angle = randUniform(0, 2 * Math.PI);
        let x = r * Math.sin(angle);
        let y = r * Math.cos(angle);
        let noiseX = randUniform(-radius, radius) * noise;
        let noiseY = randUniform(-radius, radius) * noise;
        let label = getCircleLabel({ x: x + noiseX, y: y + noiseY }, { x: 0, y: 0 });
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
function classifyXORData(numSamples, noise) {
    function getXORLabel(p) { return p.x * p.y >= 0 ? 1 : -1; }
    let points = [];
    for (let i = 0; i < numSamples; i++) {
        // let x = randUniform(-5, 5);
        // let padding = 0.3;
        // x += x > 0 ? padding : -padding;
        // let y = randUniform(-5, 5);
        // y += y > 0 ? padding : -padding;
        // let noiseX = randUniform(-5, 5) * noise;
        // let noiseY = randUniform(-5, 5) * noise;
        let x = randUniform(-6, 6);
        let padding = 0.3;
        x += x > 0 ? padding : -padding;
        let y = randUniform(-6, 6);
        y += y > 0 ? padding : -padding;
        let noiseX = randUniform(-6, 6) * noise;
        let noiseY = randUniform(-6, 6) * noise;
        let label = getXORLabel({ x: x + noiseX, y: y + noiseY });
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
function randUniform(a, b) {
    return Math.random() * (b - a) + a;
}
function normalRandom(mean, variance) {
    if (mean === void 0) { mean = 0; }
    if (variance === void 0) { variance = 1; }
    let v1, v2, s;
    do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        s = v1 * v1 + v2 * v2;
    } while (s > 1);
    let result = Math.sqrt(-2 * Math.log(s) / s) * v1;
    return mean + Math.sqrt(variance) * result;
}
function dist(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

class Node {
  constructor(id, activation, initZero) {
    this.inputLinks = [];
    this.bias = 0.1;
    this.outputs = [];
    this.outputDer = 0;
    this.inputDer = 0;
    this.accInputDer = 0;
    this.numAccumulatedDers = 0;
    this.id = id;
    this.activation = activation;
    if (initZero) {
      this.bias = 0;
    }
  }
  updateOutput() {
    this.totalInput = this.bias;
    for (let j = 0; j < this.inputLinks.length; j++) {
      let link = this.inputLinks[j];
      this.totalInput += link.weight * link.source.output;
    }
    this.output = this.activation.output(this.totalInput); // ПОЧЕМУ-ТО НЕ ДЕЛАЕТСЯ OUTPUT
    return this.output;
  }
}

class Errors{
    static SQUARE = {
        error: function (output, target) {
            return 0.5 * Math.pow(output - target, 2);
        },
        der: function (output, target) { return output - target; }
    }
} 

Math.tanh = Math.tanh || function (x) {
    if (x === Infinity) {
        return 1;
    }
    else if (x === -Infinity) {
        return -1;
    }
    else {
        let e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }
};

class Activations {
    static TANH = {
        output: function (x) { return Math.tanh(x); },
        der: function (x) {
            let output = Activations.TANH.output(x);
            return 1 - output * output;
        },
        toString: function() { return "tanh" }
    }
    static RELU = {
        output: function (x) { return Math.max(0, x); },
        der: function (x) { return x <= 0 ? 0 : 1; },
        toString: function() { return "relu" }
    }
    static SIGMOID = {
        output: function (x) { return 1 / (1 + Math.exp(-x)); },
        der: function (x) {
            let output = Activations.SIGMOID.output(x);
            return output * (1 - output);
        },
        toString: function() { return "logistic" }
    }
    static LINEAR = {
        output: function (x) { return x; },
        der: function (x) { return 1; },
        toString: function() { return "identity" }
    }
}
class RegularizationFunction {
    static L1 = {
        output: function (w) { return Math.abs(w); },
        der: function (w) { return w < 0 ? -1 : (w > 0 ? 1 : 0); }
    }
    static L2 = {
        output: function (w) { return 0.5 * w * w; },
        der: function (w) { return w; }
    }   
}
class Link {
  constructor(source, dest, regularization, initZero) {
    this.weight = Math.random() - 0.5;
    this.isDead = false;
    this.errorDer = 0;
    this.accErrorDer = 0;
    this.numAccumulatedDers = 0;
    this.id = source.id + "-" + dest.id;
    this.source = source;
    this.dest = dest;
    this.regularization = regularization;
    if (initZero) {
      this.weight = 0;
    }
  }
}

function forEachNode(network, ignoreInputs, accessor) {
    for (let layerIdx = ignoreInputs ? 1 : 0; layerIdx < network.length; layerIdx++) {
        let currentLayer = network[layerIdx];
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];
            accessor(node);
        }
    }
}

function getOutputNode(network) {
    return network[network.length - 1][0];
}
    //
    //function buildNetwork(networkShape, activation, outputActivation, regularization, inputIds, initZero) {
    //    let numLayers = networkShape.length;
    //    let id = 1;
    //    let network = [];
    //    for (let layerIdx = 0; layerIdx < numLayers; layerIdx++) {
    //        let isOutputLayer = layerIdx === numLayers - 1;
    //        let isInputLayer = layerIdx === 0;
    //        let currentLayer = [];
    //        network.push(currentLayer);
    //        let numNodes = networkShape[layerIdx];
    //        for (let i = 0; i < numNodes; i++) {
    //            let nodeId = id.toString();
    //            if (isInputLayer) {
    //                nodeId = inputIds[i];
    //            }
    //            else {
    //                id++;
    //            }
    //            let node = new Node(nodeId, isOutputLayer ? outputActivation : activation, initZero);
    //            currentLayer.push(node);
    //            if (layerIdx >= 1) {
    //                for (let j = 0; j < network[layerIdx - 1].length; j++) {
    //                    let prevNode = network[layerIdx - 1][j];
    //                    let link = new Link(prevNode, node, regularization, initZero);
    //                    prevNode.outputs.push(link);
    //                    node.inputLinks.push(link);
    //                }
    //            }
    //        }
    //    }
    //    return network;
    //}
//----------------------------------------------------------------------------------------------------------------ОК


function forwardProp(network, inputs) {
    let inputLayer = network[0];
    if (inputs.length !== inputLayer.length) {
        throw new Error("The number of inputs must match the number of nodes in the input layer");
    }
    for (let i = 0; i < inputLayer.length; i++) {
        let node = inputLayer[i];
        node.output = inputs[i];
    }
    for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
        let currentLayer = network[layerIdx];
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];
            node.updateOutput();
        }
    }
    return network[network.length - 1][0].output;
}
function updateWeights(network, learningRate, regularizationRate) { // Она вызывает проблемы и она не нужна
    for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
        let currentLayer = network[layerIdx];
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];
            if (node.numAccumulatedDers > 0) {
                node.bias -= learningRate * node.accInputDer / node.numAccumulatedDers;
                node.accInputDer = 0;
                node.numAccumulatedDers = 0;
            }
            for (let j = 0; j < node.inputLinks.length; j++) {
                let link = node.inputLinks[j];
                if (link.isDead) {
                    continue;
                }
                let regulDer = link.regularization ?
                    link.regularization.der(link.weight) : 0;
                if (link.numAccumulatedDers > 0) {
                    link.weight = link.weight -
                        (learningRate / link.numAccumulatedDers) * link.accErrorDer;
                    let newLinkWeight = link.weight -
                        (learningRate * regularizationRate) * regulDer;
                    if (link.regularization === RegularizationFunction.L1 &&
                        link.weight * newLinkWeight < 0) {
                        link.weight = 0;
                        link.isDead = true;
                    }
                    else {
                        link.weight = newLinkWeight;
                    }
                    link.accErrorDer = 0;
                    link.numAccumulatedDers = 0;
                }
            }
        }
    }
}



let HIDE_STATE_SUFFIX = "_hide";
let activations = {
    "relu": Activations.RELU,
    "tanh": Activations.TANH,
    "sigmoid": Activations.SIGMOID,
    "linear": Activations.LINEAR
};
let regularizations = {
    "none": null,
    "L1": RegularizationFunction.L1,
    "L2": RegularizationFunction.L2
};
let datasets = {
    "circle": classifyCircleData,
    "xor": classifyXORData,
    "gauss": classifyTwoGaussData,
    "spiral": classifySpiralData
};
datasets.regDatasets = {
    "reg-plane": regressPlane,
    "reg-gauss": regressGaussian
};
function getKeyFromValue(obj, value) {
    for (let key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return undefined;
}
getKeyFromValue = getKeyFromValue;
function endsWith(s, suffix) {
    return s.substr(-suffix.length) === suffix;
}
function getHideProps(obj) {
    let result = [];
    for (let prop in obj) {
        if (endsWith(prop, HIDE_STATE_SUFFIX)) {
            result.push(prop);
        }
    }
    return result;
}
let Type;
(function (Type) {
    Type[Type["STRING"] = 0] = "STRING";
    Type[Type["NUMBER"] = 1] = "NUMBER";
    Type[Type["ARRAY_NUMBER"] = 2] = "ARRAY_NUMBER";
    Type[Type["ARRAY_STRING"] = 3] = "ARRAY_STRING";
    Type[Type["BOOLEAN"] = 4] = "BOOLEAN";
    Type[Type["OBJECT"] = 5] = "OBJECT";
})(Type = Type || (Type = {}));
let Problem;
(function (Problem) {
    Problem[Problem["CLASSIFICATION"] = 0] = "CLASSIFICATION";
    Problem[Problem["REGRESSION"] = 1] = "REGRESSION";
})(Problem = Problem || (Problem = {}));
let problems = {
    "classification": Problem.CLASSIFICATION,
    "regression": Problem.REGRESSION
};

class State {
  constructor() {
    this.learningRate = 0.03;
    this.regularizationRate = 0;
    this.showTestData = false;
    this.noise = 0;
    this.batchSize = 10;
    this.discretize = false;
    this.tutorial = null;
    this.percTrainData = 50;
    this.activation = Activations.TANH;
    this.regularization = null;
    this.problem = Problem.CLASSIFICATION;
    this.initZero = false;
    this.hideText = false;
    this.collectStats = false;
    this.numHiddenLayers = 1;
    this.hiddenLayerControls = [];
    this.networkShape = [4, 2];
    this.x = true;
    this.y = true;
    this.xTimesY = false;
    this.xSquared = false;
    this.ySquared = false;
    this.cosX = false;
    this.sinX = false;
    this.cosY = false;
    this.sinY = false;
    this.dataset = classifyCircleData;
    this.regDataset = regressPlane;
  }
  serialize() {
    let _this = this;
    let props = [];
    State.PROPS.forEach(function (_a) {
      let name = _a.name, type = _a.type, keyMap = _a.keyMap;
      let value = _this[name];
      if (value == null) {
        return;
      }
      if (type === Type.OBJECT) {
        value = getKeyFromValue(keyMap, value);
      }
      else if (type === Type.ARRAY_NUMBER ||
        type === Type.ARRAY_STRING) {
        value = value.join(",");
      }
      props.push(name + "=" + value);
    });
    getHideProps(this).forEach(function (prop) {
      props.push(prop + "=" + _this[prop]);
    });
    window.location.hash = props.join("&");
  }
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
  static deserializeState() {
    let map = {};
    for (let _i = 0, _a = window.location.hash.slice(1).split("&"); _i < _a.length; _i++) {
      let keyvalue = _a[_i];
      let _b = keyvalue.split("="), name_1 = _b[0], value = _b[1];
      map[name_1] = value;
    }
    let state = new State();
    function hasKey(name) {
      return name in map && map[name] != null && map[name].trim() !== "";
    }
    function parseArray(value) {
      return value.trim() === "" ? [] : value.split(",");
    }
    State.PROPS.forEach(function (_a) {
      let name = _a.name, type = _a.type, keyMap = _a.keyMap;
      switch (type) {
        case Type.OBJECT:
          if (keyMap == null) {
            throw Error("A key-value map must be provided for state " +
              "variables of type Object");
          }
          if (hasKey(name) && map[name] in keyMap) {
            state[name] = keyMap[map[name]];
          }
          break;
        case Type.NUMBER:
          if (hasKey(name)) {
            state[name] = +map[name];
          }
          break;
        case Type.STRING:
          if (hasKey(name)) {
            state[name] = map[name];
          }
          break;
        case Type.BOOLEAN:
          if (hasKey(name)) {
            state[name] = (map[name] === "false" ? false : true);
          }
          break;
        case Type.ARRAY_NUMBER:
          if (name in map) {
            state[name] = parseArray(map[name]).map(Number);
          }
          break;
        case Type.ARRAY_STRING:
          if (name in map) {
            state[name] = parseArray(map[name]);
          }
          break;
        default:
          throw Error("Encountered an unknown type for a state variable");
      }
    });
    getHideProps(map).forEach(function (prop) {
      state[prop] = (map[prop] === "true") ? true : false;
    });
    state.numHiddenLayers = state.networkShape.length;
    if (state.seed == null) {
      state.seed = Math.random().toFixed(5);
    }
    Math.seedrandom(state.seed);
    return state;
  }
}
State.PROPS = [
    { name: "activation", type: Type.OBJECT, keyMap: activations },
    { name: "regularization", type: Type.OBJECT, keyMap: regularizations },
    { name: "batchSize", type: Type.NUMBER },
    { name: "dataset", type: Type.OBJECT, keyMap: datasets },
    { name: "regDataset", type: Type.OBJECT, keyMap: datasets.regDatasets },
    { name: "learningRate", type: Type.NUMBER },
    { name: "regularizationRate", type: Type.NUMBER },
    { name: "noise", type: Type.NUMBER },
    { name: "networkShape", type: Type.ARRAY_NUMBER },
    { name: "seed", type: Type.STRING },
    { name: "showTestData", type: Type.BOOLEAN },
    { name: "discretize", type: Type.BOOLEAN },
    { name: "percTrainData", type: Type.NUMBER },
    { name: "x", type: Type.BOOLEAN },
    { name: "y", type: Type.BOOLEAN },
    { name: "xTimesY", type: Type.BOOLEAN },
    { name: "xSquared", type: Type.BOOLEAN },
    { name: "ySquared", type: Type.BOOLEAN },
    { name: "cosX", type: Type.BOOLEAN },
    { name: "sinX", type: Type.BOOLEAN },
    { name: "cosY", type: Type.BOOLEAN },
    { name: "sinY", type: Type.BOOLEAN },
    { name: "collectStats", type: Type.BOOLEAN },
    { name: "tutorial", type: Type.STRING },
    { name: "problem", type: Type.OBJECT, keyMap: problems },
    { name: "initZero", type: Type.BOOLEAN },
    { name: "hideText", type: Type.BOOLEAN }
];

let NUM_SHADES = 100;

class HeatMap {
    constructor(width, numSamples, xDomain, yDomain, container, userSettings) {
        this.settings = {
            showAxes: false,
            noSvg: false
        };
        this.numSamples = numSamples;
        let height = width;
        let padding = userSettings.showAxes ? 20 : 0;
        if (userSettings != null) {
            for (let prop in userSettings) {
                this.settings[prop] = userSettings[prop];
            }
        }

        this.xScale = d3.scale.linear()
            .domain(xDomain)
            .range([0, width - 2 * padding]);
        this.yScale = d3.scale.linear()
            .domain(yDomain)
            .range([height - 2 * padding, 0]);
        let tmpScale = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#FF1493", "white", "#00FA9A"])
            .clamp(true);
        let colors = d3.range(0, 1 + 1E-9, 1 / NUM_SHADES).map(function (a) {
            return tmpScale(a);
        });
        this.color = d3.scale.quantize()
            .domain([-1, 1])
            .range(colors);
        container = container.append("div")
            .style({
                width: width + "px",
                height: height + "px",
                position: "relative",
                top: "-" + padding + "px",
                left: "-" + padding + "px"
            });
        this.canvas = container.append("canvas")
            .attr("width", numSamples)
            .attr("height", numSamples)
            .style("width", (width - 2 * padding) + "px")
            .style("height", (height - 2 * padding) + "px")
            .style("position", "absolute")
            .style("top", padding + "px")
            .style("left", padding + "px");
        
        if (!this.settings.noSvg) {
            this.svg = container.append("svg").attr({
                "width": width,
                "height": height
            }).style({
                "position": "absolute",
                "left": "0",
                "top": "0"
            }).append("g")
                .attr("transform", "translate(" + padding + "," + padding + ")");
            this.svg.append("g").attr("class", "train");
            this.svg.append("g").attr("class", "test");
        }
        if (this.settings.showAxes) {
            let xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient("bottom");
            let yAxis = d3.svg.axis()
                .scale(this.yScale)
                .orient("right");
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - 2 * padding) + ")")
                .call(xAxis);
            this.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + (width - 2 * padding) + ",0)")
                .call(yAxis);
        }
    }
    updateTestPoints(points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.test"), points);
    }
    updatePoints(points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.train"), points);
    }
    updateBackground(data, discretize) {
        let dx = data[0].length;
        let dy = data.length;

        let context = this.canvas.node().getContext("2d");
        let image = context.createImageData(dx, dy);

        for (let y = 0, p = -1; y < dy; ++y) {
            for (let x = 0; x < dx; ++x) {
                let value = data[x][y];
                if (discretize) {
                    value = (value >= 0 ? 1 : -1);
                }
                let c = d3.rgb(this.color(value));
                image.data[++p] = c.r;
                image.data[++p] = c.g;
                image.data[++p] = c.b;
                image.data[++p] = 160;
            }
        }
        context.putImageData(image, 0, 0);

    }
    updateCircles(container, points) {
        let _this = this;
        let xDomain = this.xScale.domain();
        let yDomain = this.yScale.domain();
        points = points.filter(function (p) {
            return p.x >= xDomain[0] && p.x <= xDomain[1]
                && p.y >= yDomain[0] && p.y <= yDomain[1];
        });
        let selection = container.selectAll("circle").data(points);
        selection.enter().append("circle").attr("r", 3);
        selection
            .attr({
                cx: function (d) { return _this.xScale(d.x); },
                cy: function (d) { return _this.yScale(d.y); }
            })
            .style("fill", function (d) { return _this.color(d.label); });
        selection.exit().remove();
    }
}

function reduceMatrix(matrix, factor) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("The provided matrix must be a square matrix");
    }
    if (matrix.length % factor !== 0) {
        throw new Error("The width/height of the matrix must be divisible by " +
            "the reduction factor");
    }

    let result = new Array(matrix.length / factor);

    for (let i = 0; i < matrix.length; i += factor) {
        result[i / factor] = new Array(matrix.length / factor);
        for (let j = 0; j < matrix.length; j += factor) {

            let avg = 0; for (let k = 0; k < factor; k++) {
                for (let l = 0; l < factor; l++) {
                    avg += matrix[i + k][j + l];
                }
            }
            avg /= (factor * factor);
            result[i / factor][j / factor] = avg;
        }
    }
    return result;
}

let AppendingLineChart = (function () {
    function AppendingLineChart(container, lineColors) {
        this.data = [];
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.lineColors = lineColors;
        this.numLines = lineColors.length;
        let node = container.node();
        let totalWidth = node.offsetWidth;
        let totalHeight = node.offsetHeight;
        let margin = { top: 2, right: 0, bottom: 2, left: 2 };
        let width = totalWidth - margin.left - margin.right;
        let height = totalHeight - margin.top - margin.bottom;
        this.xScale = d3.scale.linear()
            .domain([0, 0])
            .range([0, width]);
        this.yScale = d3.scale.linear()
            .domain([0, 0])
            .range([height, 0]);
        this.svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        this.paths = new Array(this.numLines);
        for (let i = 0; i < this.numLines; i++) {
            this.paths[i] = this.svg.append("path")
                .attr("class", "line")
                .style({
                "fill": "none",
                "stroke": lineColors[i],
                "stroke-width": "1.5px"
            });
        }
    }
    AppendingLineChart.prototype.reset = function () {
        this.data = [];
        this.redraw();
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
    };
    AppendingLineChart.prototype.addDataPoint = function (dataPoint) {
        let _this = this;
        if (dataPoint.length !== this.numLines) {
            throw Error("Length of dataPoint must equal number of lines");
        }
        dataPoint.forEach(function (y) {
            _this.minY = Math.min(_this.minY, y);
            _this.maxY = Math.max(_this.maxY, y);
        });
        this.data.push({ x: this.data.length + 1, y: dataPoint });
        this.redraw();
    };
    AppendingLineChart.prototype.redraw = function () {
        let _this = this;
        this.xScale.domain([1, this.data.length]);
        this.yScale.domain([this.minY, this.maxY]);
        let getPathMap = function (lineIndex) {
            return d3.svg.line()
                .x(function (d) { return _this.xScale(d.x); })
                .y(function (d) { return _this.yScale(d.y[lineIndex]); });
        };
        for (let i = 0; i < this.numLines; i++) {
            this.paths[i].datum(this.data).attr("d", getPathMap(i));
        }
    };
    return AppendingLineChart;
}());
AppendingLineChart = AppendingLineChart;


let mainWidth;
d3.select(".more button").on("click", function () {
    let position = 800;
    d3.transition()
        .duration(1000)
        .tween("scroll", scrollTween(position));
});
function scrollTween(offset) {
    return function () {
        let i = d3.interpolateNumber(window.pageYOffset ||
            document.documentElement.scrollTop, offset);
        return function (t) { scrollTo(0, i(t)); };
    };
}
let RECT_SIZE = 30;
let BIAS_SIZE = 5;
let NUM_SAMPLES_CLASSIFY = 500;
let NUM_SAMPLES_REGRESS = 1200;
let DENSITY = 100;
let HoverType;
(function (HoverType) {
    HoverType[HoverType["BIAS"] = 0] = "BIAS";
    HoverType[HoverType["WEIGHT"] = 1] = "WEIGHT";
})(HoverType || (HoverType = {}));
let INPUTS = {
    "x": { f: function (x, y) { return x; }, label: "X_1" },
    "y": { f: function (x, y) { return y; }, label: "X_2" },
    "xSquared": { f: function (x, y) { return x * x; }, label: "X_1^2" },
    "ySquared": { f: function (x, y) { return y * y; }, label: "X_2^2" },
    "xTimesY": { f: function (x, y) { return x * y; }, label: "X_1X_2" },
    "sinX": { f: function (x, y) { return Math.sin(x); }, label: "sin(X_1)" },
    "sinY": { f: function (x, y) { return Math.sin(y); }, label: "sin(X_2)" }
};
let HIDABLE_CONTROLS = [
    ["Show test data", "showTestData"],
    ["Discretize output", "discretize"],
    ["Play button", "playButton"],
    ["Step button", "stepButton"],
    ["Reset button", "resetButton"],
    ["Learning rate", "learningRate"],
    ["Activation", "activation"],
    ["Regularization", "regularization"],
    ["Regularization rate", "regularizationRate"],
    ["Problem type", "problem"],
    ["Which dataset", "dataset"],
    ["Ratio train data", "percTrainData"],
    ["Noise level", "noise"],
    ["Batch size", "batchSize"],
    ["# of hidden layers", "numHiddenLayers"],
];

class Player {
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
            if (iter === 0) {
            }
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
            oneStep();
            return false;
        }, 0);
    }
}

let state = State.deserializeState();
state.getHiddenProps().forEach(function (prop) {
    if (prop in INPUTS) {
        delete INPUTS[prop];
    }
});
let boundary = {};
let selectedNodeId = null;
let xDomain = [-6, 6];
let heatMap = new HeatMap(700, DENSITY, xDomain, xDomain, d3.select("#heatmap"), { showAxes: true });
let finalNeuron = new HeatMap(300, DENSITY, xDomain, xDomain, d3.select("#finalNeuron"), { showAxes: true });
let linkWidthScale = d3.scale.linear()
    .domain([0, 5])
    .range([1, 10])
    .clamp(true);
let colorScale = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["#FF1493", "#e8eaeb", "#00FA9A"])
    .clamp(true);
let iter = 0;
let trainData = [];
let testData = [];
let network = null;
let lossTrain = 0;
let lossTest = 0;
let player = new Player();
let lineChart = new AppendingLineChart(d3.selectAll("#linechart"), ["#777", "black"]);

// OK
function makeGUI() {
    d3.select("#reset-button").on("click", function () {
        reset();
        d3.select("#play-pause-button");
    });
    d3.select("#play-pause-button").on("click", function () {
        player.playOrPause();
    });
    player.onPlayPause(function (isPlaying) {
        d3.select("#play-pause-button").classed("playing", isPlaying);
    });
    d3.select("#next-step-button").on("click", function () {
        player.pause();
        oneStep();
    });
    d3.select("#data-regen-button").on("click", function () {
        generateData();
        reset();
    });
    
    let dataThumbnails = d3.selectAll("canvas[data-dataset]");
    dataThumbnails.on("click", function () {
        let newDataset = datasets[this.dataset.dataset];
        if (newDataset === state.dataset) {
            return;
        }
        //nullify
        state.dataset = newDataset;
        dataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateData();
        reset();
    });
    let datasetKey = getKeyFromValue(datasets, state.dataset);
    d3.select("canvas[data-dataset=" + datasetKey + "]")
        .classed("selected", true);
    let regDataThumbnails = d3.selectAll("canvas[data-regDataset]");
    regDataThumbnails.on("click", function () {
        let newDataset = datasets.regDatasets[this.dataset.regdataset];
        if (newDataset === state.regDataset) {
            return;
        }
        state.regDataset = newDataset;
        regDataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateData();
        reset();
    });
    let regDatasetKey = getKeyFromValue(datasets.regDatasets, state.regDataset);
    d3.select("canvas[data-regDataset=" + regDatasetKey + "]")
        .classed("selected", true);

    d3.select("#add-layers").on("click", function () {
        if (state.numHiddenLayers >= 6) {
            return;
        }
        state.networkShape[state.numHiddenLayers] = 2;
        state.numHiddenLayers++;
        reset();
    });
    d3.select("#remove-layers").on("click", function () {
        if (state.numHiddenLayers <= 0) {
            return;
        }
        state.numHiddenLayers--;
        state.networkShape.splice(state.numHiddenLayers);
        reset();
    });

    showTestData = d3.select("#show-test-data").on("change", function () {
        state.showTestData = this.checked;
        state.serialize();
        heatMap.updateTestPoints(state.showTestData ? testData : []);
        finalNeuron.updateTestPoints(state.showTestData ? testData : []);
    });
    showTestData.property("checked", state.showTestData);
    let discretize = d3.select("#discretize").on("change", function () {
        state.discretize = this.checked;
        state.serialize();
        updateUI(true);
    });
    discretize.property("checked", state.discretize);

    let percTrain = d3.select("#percTrainData").on("input", function () {
        state.percTrainData = this.value;
        d3.select("label[for='percTrainData'] .value").text(this.value);
        generateData();
        reset();
    });
    percTrain.property("value", state.percTrainData);
    
    d3.select("label[for='percTrainData'] .value").text(state.percTrainData);
    let noise = d3.select("#noise").on("input", function () {
        state.noise = this.value;
        d3.select("label[for='noise'] .value").text(this.value);
        generateData();
        reset();
    });
    let currentMax = parseInt(noise.property("max"));
    if (state.noise > currentMax) {
        if (state.noise <= 80) {
            noise.property("max", state.noise);
        }
        else {
            state.noise = 50;
        }
    }
    else if (state.noise < 0) {
        state.noise = 0;
    }
    noise.property("value", state.noise);
    d3.select("label[for='noise'] .value").text(state.noise);
    
    let batchSize = d3.select("#batchSize").on("input", function () {
        state.batchSize = this.value;
        d3.select("label[for='batchSize'] .value").text(this.value);
        reset();
    });
    batchSize.property("value", state.batchSize);
    d3.select("label[for='batchSize'] .value").text(state.batchSize);

    let activationDropdown = d3.select("#activations").on("change", function () {
        state.activation = activations[this.value];
        reset();
    });
    activationDropdown.property("value", getKeyFromValue(activations, state.activation));

    let learningRate = d3.select("#learningRate").on("change", function () {
        state.learningRate = +this.value;
        state.serialize();
        reset();
    });
    learningRate.property("value", state.learningRate);

    let regularDropdown = d3.select("#regularizations").on("change", function () {
        state.regularization = regularizations[this.value];
        reset();
    });
    regularDropdown.property("value", getKeyFromValue(regularizations, state.regularization));

    let regularRate = d3.select("#regularRate").on("change", function () {
        state.regularizationRate = +this.value;
        reset();
    });
    regularRate.property("value", state.regularizationRate);

    let problem = d3.select("#problem").on("change", function () {
        state.problem = problems[this.value];
        generateData();
        drawDatasetThumbnails();
        reset();
    });
    problem.property("value", getKeyFromValue(problems, state.problem));
    
    let x = d3.scale.linear().domain([-1, 1]).range([0, 144]);
    let xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues([-1, 0, 1])
        .tickFormat(d3.format("d"));
    d3.select("#colormap g.core").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,10)")
        .call(xAxis);

    window.addEventListener("resize", function () {
      let newWidth  = document.querySelector("#main-part").getBoundingClientRect().width; 

      if (newWidth !== mainWidth) {
          mainWidth = newWidth;
          updateUI(false); // false -- генеритть новое не нужно
      }
    });
    if (state.hideText) {
        d3.select("#article-text").style("display", "none");
        d3.select("div.more").style("display", "none");
        d3.select("header").style("display", "none");
    }
}

// OK -- рисует
function updateBiasesUI(network) {
    forEachNode(network, true, function (node) {
        d3.select("rect#bias-" + node.id).style("fill", colorScale(node.bias));
    });
}
// OK -- рисует
function updateWeightsUI(network, container) {
    for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
        let currentLayer = network[layerIdx];
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];
            for (let j = 0; j < node.inputLinks.length; j++) {
                let link = node.inputLinks[j];
                container.select("#link" + link.source.id + "-" + link.dest.id)
                    .style({
                    "stroke-width": linkWidthScale(Math.abs(link.weight)),
                    "stroke": colorScale(link.weight)
                })
                    .datum(link);
            }
        }
    }
}

//=========== Рисуем 1 узел
function drawNode(cx, cy, nodeId, isInput, container, node) {
    let x = cx - RECT_SIZE / 2;
    let y = cy - RECT_SIZE / 2;
    let nodeGroup = container.append("g")
        .attr({
        "class": "node",
        "id": "node" + nodeId,
        "transform": "translate(" + x + "," + y + ")"
    });
    nodeGroup.append("rect")
        .attr({
        x: 0,
        y: 0,
        width: RECT_SIZE,
        height: RECT_SIZE
    });
    let activeOrNotClass = state[nodeId] ? "active" : "inactive";
    if (isInput) {
        let label = INPUTS[nodeId].label != null ?
            INPUTS[nodeId].label : nodeId;
        let text = nodeGroup.append("text").attr({
            "class": "main-label",
            x: -10,
            y: RECT_SIZE / 2, "text-anchor": "end"
        });
        if (/[_^]/.test(label)) {
            let myRe = /(.*?)([_^])(.)/g;
            let myArray = void 0;
            let lastIndex = void 0;
            while ((myArray = myRe.exec(label)) != null) {
                lastIndex = myRe.lastIndex;
                let prefix = myArray[1];
                let sep = myArray[2];
                let suffix = myArray[3];
                if (prefix) {
                    text.append("tspan").text(prefix);
                }
                text.append("tspan")
                    .attr("baseline-shift", sep === "_" ? "sub" : "super")
                    .style("font-size", "9px")
                    .text(suffix);
            }
            if (label.substring(lastIndex)) {
                text.append("tspan").text(label.substring(lastIndex));
            }
        }
        else {
            text.append("tspan").text(label);
        }
        nodeGroup.classed(activeOrNotClass, true);
    }
    if (!isInput) {
        nodeGroup.append("rect")
            .attr({
            id: "bias-" + nodeId,
            x: -BIAS_SIZE - 2,
            y: RECT_SIZE - BIAS_SIZE + 3,
            width: BIAS_SIZE,
            height: BIAS_SIZE
        }).on("mouseenter", function () {
            updateHoverCard(HoverType.BIAS, node, d3.mouse(container.node()));
        }).on("mouseleave", function () {
            updateHoverCard(null);
        });
    }
    let div = d3.select("#network").insert("div", ":first-child")
        .attr({
        "id": "canvas-" + nodeId,
        "class": "canvas"
    })
        .style({
        position: "absolute",
        left: x + 3 + "px",
        top: y + 3 + "px"
    })
        .on("mouseenter", function () {
        selectedNodeId = nodeId;
        div.classed("hovered", true);
        nodeGroup.classed("hovered", true);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nodeId], state.discretize);
        finalNeuron.updateBackground(boundary[nodeId], state.discretize);
    })
        .on("mouseleave", function () {
        selectedNodeId = null;
        div.classed("hovered", false);
        nodeGroup.classed("hovered", false);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[getOutputNode(network).id], state.discretize);
        finalNeuron.updateBackground(boundary[getOutputNode(network).id], state.discretize);
    });
    if (isInput) {
        div.on("click", function () {
            state[nodeId] = !state[nodeId];
            reset();
        });
        div.style("cursor", "pointer");
    }
    if (isInput) {
        div.classed(activeOrNotClass, true);
    }
    let nodeHeatMap = new HeatMap(RECT_SIZE, DENSITY / 10, xDomain, xDomain, div, { noSvg: true });
    div.datum({ heatmap: nodeHeatMap, id: nodeId });
}
//=========== Рисуем все узлы
// Варианты
//1проблема у андрея
// неправильная логика обработки данных для рисовки
// с самой рисовкой пизда
function drawNetwork(network) {
    console.log('drawNetwork');

    let svg = d3.select("#svg");
    svg.select("g.core").remove();
    d3.select("#network").selectAll("div.canvas").remove();
    d3.select("#network").selectAll("div.plus-minus-neurons").remove();
    let padding = 3;
    let co = d3.select(".column.output").node();
    let cf = d3.select(".column.features").node();
    let width = co.offsetLeft - cf.offsetLeft;
    svg.attr("width", width);

    let node2coord = {};
    let container = svg.append("g")
        .classed("core", true)
        .attr("transform", "translate(" + padding + "," + padding + ")");
    let numLayers = network.length; // Всё ок
    let featureWidth = 118;

    let layerScale = d3.scale.ordinal()
        .domain(d3.range(1, numLayers - 1))
        .rangePoints([featureWidth, width - RECT_SIZE], 0.7);
    let nodeIndexScale = function (nodeIndex) { return nodeIndex * (RECT_SIZE + 25); };
    let calloutThumb = d3.select(".callout.thumbnail").style("display", "none");
    let calloutWeights = d3.select(".callout.weights").style("display", "none");
    let idWithCallout = null;
    let targetIdWithCallout = null;
    let cx = RECT_SIZE / 2 + 50;
    let nodeIds = Object.keys(INPUTS);
    let maxY = nodeIndexScale(nodeIds.length);
    // Рисование первоначальных узлов
    nodeIds.forEach(function (nodeId, i) {
        let cy = nodeIndexScale(i) + RECT_SIZE / 2;
        node2coord[nodeId] = { cx: cx, cy: cy };
        drawNode(cx, cy, nodeId, true, container);
    }); // Тут все рисуются

    for (let layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) { // Здесь не определяются позиции узлов
        let numNodes = network[layerIdx].length;
        let cx_1 = layerScale(layerIdx) + RECT_SIZE / 2;
        maxY = Math.max(maxY, nodeIndexScale(numNodes));
        addPlusMinusControl(layerScale(layerIdx), layerIdx);

        // Проходимся по конкретным узлам. Тут что-то сломалось.
        for (let i = 0; i < numNodes; i++) {
            let node_1 = network[layerIdx][i];
            let cy_1 = nodeIndexScale(i) + RECT_SIZE / 2;
            node2coord[node_1.id] = { cx: cx_1, cy: cy_1 };
            drawNode(cx_1, cy_1, node_1.id, false, container, node_1);
            let numNodes_1 = network[layerIdx].length;
            let nextNumNodes = network[layerIdx + 1].length;
            if (idWithCallout == null && i === numNodes_1 - 1 && nextNumNodes <= numNodes_1) {
                calloutThumb.style({
                    display: null,
                    top: 20 + 3 + cy_1 + "px",
                    left: cx_1 + "px"
                });
                idWithCallout = node_1.id;
            }
            // Вызываем отрисовку у узла. Узел содержит cx и cy. Этот узел -- все узлы из предыдущего слоя
            for (let j = 0; j < node_1.inputLinks.length; j++) {
                let link = node_1.inputLinks[j]; // связь
                let path = drawLink(link, node2coord, network, container, j === 0, j, node_1.inputLinks.length).node();
                let prevLayer = network[layerIdx - 1];
                let lastNodePrevLayer = prevLayer[prevLayer.length - 1];
                if (targetIdWithCallout == null &&
                    i === numNodes_1 - 1 &&
                    link.source.id === lastNodePrevLayer.id &&
                    (link.source.id !== idWithCallout || numLayers <= 5) &&
                    link.dest.id !== idWithCallout &&
                    prevLayer.length >= numNodes_1) {
                    let midPoint = path.getPointAtLength(path.getTotalLength() * 0.7);
                    calloutWeights.style({
                        display: null,
                        top: midPoint.y + 5 + "px",
                        left: midPoint.x + 3 + "px"
                    });
                    targetIdWithCallout = link.dest.id;
                }
            }
        }
    }

    cx = width + RECT_SIZE / 2;
    let node = network[numLayers - 1][0];
    let cy = nodeIndexScale(0) + RECT_SIZE / 2;
    node2coord[node.id] = { cx: cx, cy: cy };// По идее тут должен быть последний узел
    for (let i = 0; i < node.inputLinks.length; i++) {
        let link = node.inputLinks[i];
        drawLink(link, node2coord, network, container, i === 0, i, node.inputLinks.length);
    }
    svg.attr("height", maxY);
    let height = Math.max(getRelativeHeight(calloutThumb), getRelativeHeight(calloutWeights), getRelativeHeight(d3.select("#network")));
    d3.select(".column.features").style("height", height + "px");

//    iter++;
//    d3.select("#iter-number").text((iter / 1000).toFixed(3));
    
}
function getRelativeHeight(selection) {
    let node = selection.node();
    return node.offsetHeight + node.offsetTop;
}

// OK
function addPlusMinusControl(x, layerIdx) {
    let div = d3.select("#network").append("div")
        .classed("plus-minus-neurons", true)
        .style("left", x - 10 + "px");
    let i = layerIdx - 1;
    let firstRow = div.append("div").attr("class", "ui-numNodes" + layerIdx);
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        let numNeurons = state.networkShape[i];
        if (numNeurons >= 8) {
            return;
        }
        state.networkShape[i]++;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("add");
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        let numNeurons = state.networkShape[i];
        if (numNeurons <= 1) {
            return;
        }
        state.networkShape[i]--;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("remove");
    let suffix = state.networkShape[i] > 1 ? "s" : "";
    div.append("div").text(state.networkShape[i] + " neuron" + suffix);
}
// OK
function updateHoverCard(type, nodeOrLink, coordinates) {
    let hovercard = d3.select("#hovercard");
    if (type == null) {
        hovercard.style("display", "none");
        d3.select("#svg").on("click", null);
        return;
    }
    d3.select("#svg").on("click", function () {
        hovercard.select(".value").style("display", "none");
        let input = hovercard.select("input");
        input.style("display", null);
        input.on("input", function () {
            if (this.value != null && this.value !== "") {
                if (type === HoverType.WEIGHT) {
                    nodeOrLink.weight = +this.value;
                }
                else {
                    nodeOrLink.bias = +this.value;
                }
                updateUI(false);
            }
        });
        input.on("keypress", function () {
            if (d3.event.keyCode === 13) {
                updateHoverCard(type, nodeOrLink, coordinates);
            }
        });
        input.node().focus();
    });
    let value = (type === HoverType.WEIGHT) ?
        nodeOrLink.weight :
        nodeOrLink.bias;
    let name = (type === HoverType.WEIGHT) ? "Weight" : "Bias";
    hovercard.style({
        "left": coordinates[0] + 20 + "px",
        "top": coordinates[1] + "px",
        "display": "block"
    });
    hovercard.select(".type").text(name);
    hovercard.select(".value")
        .style("display", null)
        .text(value.toPrecision(2));
    hovercard.select("input")
        .property("value", value.toPrecision(2))
        .style("display", "none");
}
// OK
function drawLink(input, node2coord, network, container, isFirst, index, length) {
//    console.log("node2coord >>:", node2coord, input.source.id);
    // Нужно перепилить входные значения
//    let inputId = input.source.id;
//    switch(input.source.id)
//    {
//        case 1: inputId = 'x';        break;
//        case 2: inputId = 'y';        break;
//        case 3: inputId = 'xSquared'; break;
//        case 4: inputId = 'ySquared'; break;
//        case 5: inputId = 'sinX';     break;
//        case 6: inputId = 'sinY';     break;
//    }

    let line = container.insert("path", ":first-child");
    let source = node2coord[input.source.id];//inputId
    let dest = node2coord[input.dest.id];

    let datum = {
        source: {
            y: source.cx + RECT_SIZE / 2 + 2,
            x: source.cy
        },
        target: {
            y: dest.cx - RECT_SIZE / 2,
            x: dest.cy + ((index - (length - 1) / 2) / length) * 12
        }
    };
    let diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });
    line.attr({
        "class": "link",
        id: "link" + input.source.id + "-" + input.dest.id,
        d: "M " + datum.source.y + "," + datum.source.x + " " + datum.target.y + "," + datum.target.x + " z"
    });
    container.append("path")
        .attr("d", "M " + datum.source.y + "," + datum.source.x + " " + datum.target.y + "," + datum.target.x + " z")
        .attr("class", "link-hover")
        .on("mouseenter", function () {
        updateHoverCard(HoverType.WEIGHT, input, d3.mouse(this));
    }).on("mouseleave", function () {
        updateHoverCard(null);
    });

    return line;
}

// OK
function updateDecisionBoundary(network, firstTime) {
    if (firstTime) {
        boundary = {};
        forEachNode(network, true, function (node) {
            boundary[node.id] = new Array(DENSITY);
        });
        for (let nodeId in INPUTS) {
            boundary[nodeId] = new Array(DENSITY);
        }
    }
    let xScale = d3.scale.linear().domain([0, DENSITY - 1]).range(xDomain);
    let yScale = d3.scale.linear().domain([DENSITY - 1, 0]).range(xDomain);
    let i = 0, j = 0; for (i = 0; i < DENSITY; i++) {
        if (firstTime) {
            forEachNode(network, true, function (node) {
                boundary[node.id][i] = new Array(DENSITY);
            });
            for (let nodeId in INPUTS) {
                boundary[nodeId][i] = new Array(DENSITY);
            }
        }
        for (j = 0; j < DENSITY; j++) {
            let x = xScale(i);
            let y = yScale(j);
            let input = constructInput(x, y);
            forwardProp(network, input);
            forEachNode(network, true, function (node) {
                boundary[node.id][i][j] = node.output;
            });
            if (firstTime) {
                for (let nodeId in INPUTS) {
                    boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y);
                }
            }
        }
    }
}

// OK
function getLoss(network, dataPoints) {
    let loss = 0;
    for (let i = 0; i < dataPoints.length; i++) {
        let dataPoint = dataPoints[i];
        let input = constructInput(dataPoint.x, dataPoint.y);
        let output = forwardProp(network, input);
        loss += Errors.SQUARE.error(output, dataPoint.label);
    }
    return loss / dataPoints.length;
}

//---------------------важная функция-------------------------\\
async function updateUI(firstStep, reqType = "") {
    
    if (reqType == "ResetInit") {
        console.log('REQUEST');
        await requestMLP_RESET();
        await requestMLP_INIT();
    }
    else if (reqType == "Train") {
        console.log('REQUEST');
        await requestMLP_TRAIN();
    }
    
    console.log('After REQUEST');
    if (firstStep === void 0) { firstStep = false; }
    updateWeightsUI(network, d3.select("g.core"));
    updateBiasesUI(network);
    updateDecisionBoundary(network, firstStep);

    let selectedId = selectedNodeId != null ?
        selectedNodeId : getOutputNode(network).id;
    
    heatMap.updateBackground(boundary[selectedId], state.discretize);
    finalNeuron.updateBackground(boundary[selectedId], state.discretize);
    d3.select("#network").selectAll("div.canvas")
        .each(function (data) {
        data.heatmap.updateBackground(reduceMatrix(boundary[data.id], 10), state.discretize);
    });

    d3.selectAll("#loss-train").text(lossTrain.toFixed(5));
    d3.selectAll("#loss-test").text(lossTest.toFixed(5));

    d3.select("#iter-number").text((iter / 1000).toFixed(3));
    lineChart.addDataPoint([lossTrain, lossTest]);
}

// OK
function constructInputIds() {
    let result = [];
    for (let inputName in INPUTS) {
        if (state[inputName]) {
            result.push(inputName);
        }
    }
    return result;
}
// OK
function constructInput(x, y) {
    let input = [];
    for (let inputName in INPUTS) {
        if (state[inputName]) {
            input.push(INPUTS[inputName].f(x, y));
        }
    }
    return input;
}

//---------------------важная функция-------------------------\\
async function oneStep() {// Здесь нужно рисовать нейронку.
    d3.select("#iter-number").text((iter / 1000).toFixed(3));
    await updateUI(false, "Train"); // Запрос

    iter++;
    trainData.forEach(function (point, i) {
        let input = constructInput(point.x, point.y);
        forwardProp(network, input);
        //backProp(network, point.label, Errors.SQUARE);
//        if ((i + 1) % state.batchSize === 0) {
//            updateWeights(network, state.learningRate, state.regularizationRate);
//        }
    });
    lossTrain = getLoss(network, trainData);
    lossTest = getLoss(network, testData);
}

// OK
function getOutputWeights(network) {
    let weights = [];
    for (let layerIdx = 0; layerIdx < network.length - 1; layerIdx++) {
        let currentLayer = network[layerIdx];
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];
            for (let j = 0; j < node.outputs.length; j++) {
                let output = node.outputs[j];
                weights.push(output.weight);
            }
        }
    }
    return weights;
}

//---------------------важная функция-------------------------\\
async function reset() { // по-моему, тут просто нечему ломаться + все тесты показывают, что с ней всё ок.
    lineChart.reset();
    state.serialize();
    player.pause();
    let suffix = state.numHiddenLayers !== 1 ? "s" : "";
    d3.select("#layers-label").text("Hidden layer" + suffix);
    d3.select("#num-layers").text(state.numHiddenLayers);
    iter = 0;
    // let numInputs = constructInput(0, 0).length;
    // let shape = [numInputs].concat(state.networkShape).concat([1]);
    // let outputActivation = (state.problem === Problem.REGRESSION) ?
    //     Activations.LINEAR : Activations.TANH;
    //network = buildNetwork(shape, state.activation, outputActivation, state.regularization, constructInputIds(), state.initZero);
    await requestMLP_RESET();
    await requestMLP_INIT();
    await requestMLP_TRAIN();
    lossTrain = getLoss(network, trainData);
    lossTest = getLoss(network, testData);
    drawNetwork(network);
    updateUI(true);//"ResetInit"
}

// OK
function drawDatasetThumbnails() {
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
    d3.selectAll(".dataset").style("display", "none");
    if (state.problem === Problem.CLASSIFICATION) {
        for (let dataset in datasets) {
            let canvas = document.querySelector("canvas[data-dataset=" + dataset + "]");
            let dataGenerator = datasets[dataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
    if (state.problem === Problem.REGRESSION) {
        for (let regDataset in datasets.regDatasets) {
            let canvas = document.querySelector("canvas[data-regDataset=" + regDataset + "]");
            let dataGenerator = datasets.regDatasets[regDataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
}
// OK
function hideControls() {
    let hiddenProps = state.getHiddenProps();
    hiddenProps.forEach(function (prop) {
        let controls = d3.selectAll(".ui-" + prop);
        if (controls.size() === 0) {
            console.warn("0 html elements found with class .ui-" + prop);
        }
        controls.style("display", "none");
    });
    let hideControls = d3.select(".hide-controls");
    HIDABLE_CONTROLS.forEach(function (_a) {
        let text = _a[0], id = _a[1];
        let label = hideControls.append("label")
            .attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect");
        let input = label.append("input")
            .attr({
            type: "checkbox",
            "class": "mdl-checkbox__input"
        });
        if (hiddenProps.indexOf(id) === -1) {
            input.attr("checked", "true");
        }
        input.on("change", function () {
            state.setHideProperty(id, !this.checked);
            state.serialize();
            d3.select(".hide-controls-link")
                .attr("href", window.location.href);
        });
        label.append("span")
            .attr("class", "mdl-checkbox__label label")
            .text(text);
    });
    d3.select(".hide-controls-link")
        .attr("href", window.location.href);
}

// OK
function generateData(firstTime) {
    if (firstTime === void 0) { firstTime = false; }
    if (!firstTime) {
        state.seed = Math.random().toFixed(5);
        state.serialize();
    }
    Math.seedrandom(state.seed);
    let numSamples = (state.problem === Problem.REGRESSION) ?
        NUM_SAMPLES_REGRESS : NUM_SAMPLES_CLASSIFY;
    
    let generator = state.problem === Problem.CLASSIFICATION ?
        state.dataset : state.regDataset;

    let data = generator(numSamples, state.noise / 100);
    shuffle(data);
    let splitIndex = Math.floor(data.length * state.percTrainData / 100);
    trainData = data.slice(0, splitIndex);
    testData = data.slice(splitIndex);
    heatMap.updatePoints(trainData);
    heatMap.updateTestPoints(state.showTestData ? testData : []);
    finalNeuron.updatePoints(trainData);
    finalNeuron.updateTestPoints(state.showTestData ? testData : []);
}

let currentId_MLP = -1;
let prevResponse = "";

drawDatasetThumbnails(); // OK
makeGUI();               // OK
generateData(true);      // OK
reset();                 // OK
hideControls();          // OK


//---------------------------------------------Логика запросов. Работает.


async function requestMLP_INIT() {

    let buff_name = state.datasetName;
    let buff_actv = state.activation;

    state.datasetName = state.dataset.name;
    state.activation = state.activation.toString();

    let response = await fetch("http://localhost:8080/init", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    });

    state.datasetName = buff_name;
    state.activation = buff_actv;
    console.log('INIT');
//    console.log('response  ',response.statusText.slice(2, -1));
    

    // Нужно запомнить ID
    currentId_MLP = response.statusText.split('\\n')[1].slice(0, -1);
}
async function requestMLP_TRAIN() {

    let response = await fetch("http://localhost:8080/get_values", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: `{"id": ${currentId_MLP}, "datasetName": "${state.dataset.name}"}`
    });
    network = getResObj( JSON.parse(response.statusText.slice(2, -1)) )[1];
   
}
async function requestMLP_RESET() {
    if (currentId_MLP == -1) return;
    console.log('RESET');
    let reqBody = `{"id": ${currentId_MLP}}`;

    let response = await fetch("http://localhost:8080/reset", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: reqBody
    });


//    console.log('response  ',response);
    
    // Обнуляем ID
    currentId_MLP = -1;
}


function getResObj(resBody) { //Задаётся корректно.
    let resObj = {
        shape:          resBody.shape,
        activation:     activations[resBody.activation],
        regularization: resBody.regularization,
        input_ids:      resBody.input_ids
    }
      , resNetwork  = [];

    // Сейчас проблема такая:
    // Данные в resBody.nodes без структуры
    let currentResBodyPos = 0;
    let inputIds = constructInputIds();

    for (let i = 0; i < resObj.shape.length; i++) {
        resNetwork[i] = new Array();
        for (let j = 0; j < resBody.shape[i]; j++) {

            let node;
            if (i == 0) {
                node = new Node(inputIds[j], activations[resBody.activation], false);
            }
            else {
                node = new Node(resBody.nodes[currentResBodyPos].id, activations[resBody.activation], false);
            }

            node.inputLinks = [];
            node.outputs    = [];
            let objSrc  = {};
            let objDest = {};



            if (resBody.nodes[currentResBodyPos].inputs === null)  {resBody.nodes[currentResBodyPos].inputs = []}
            if (resBody.nodes[currentResBodyPos].outputs === null) {resBody.nodes[currentResBodyPos].outputs = []}

            if (i >= 1) {
                let currentResBodyNode = resBody.nodes[currentResBodyPos];

                for (let j = 0; j < resNetwork[i - 1].length; j++) { // По длине предыдущего слоя
                    let prevNode = resNetwork[i - 1][j]; // Берём каждый предыдущий нейрон
                    let link = new Link(prevNode, node, resBody.regularization, false);
                    link.weight = currentResBodyNode.inputs[j].weight;
                    prevNode.outputs.push(link);
                    node.inputLinks.push(link);
                }
            }
            currentResBodyPos++;
            resNetwork[i].push(node);
        }
    };

    return [resObj, resNetwork];
}
