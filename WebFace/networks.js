function div(val, by){
    return (val - val % by) / by;
}

class Point{
    constructor(x, y, val){
        this.x = x;
        this.y = y;
        this.val = val;
    }

    get_coords = function(){
        return [this.x, this.y];
    }
}

class Mlp_node {
    constructor(data){ //data comes as it is, no preparation
        this.outputs = [];
        this.inputs = [];
        if (typeof data === 'string') {
            data = data.substr(5);
            let ar = data.split("; ");
            this.id = ar[0];
            this.bias = Number(ar[1])
        }
    }

}

class Mlp_link {
    constructor(data) {
        if (typeof data === 'string') {
            data = data.substr(5);
            let ar = data.split("; ");
            this.id = ar[0];
            this.weight = Number(ar[1]);
            let path = this.id.split('-');
            this.start = Number(path[0]);
            this.end = Number(path[1]);
        }
    }
}

class Mlp {
    constructor(data){
        if (typeof data === "string"){
            let parts = data.split('\n');
            let sizes = parts[0].substr(1, parts[0].length-1).split(',');
            this.inputs = parts[1];
            this.structure = Mlp_node[sizes.length][Math.max(sizes)];
            for (let part in parts){
                if (part.substr(0,4) === 'node'){
                    let node = Mlp_node(part);
                    let layer = div(node.id, 100);
                    let pos = node.id % 100;
                    this.structure[layer][pos] = node;
                }
            }
            for (let part in parts){
                if (part.substr(0,4) === 'link') {
                    let link = Mlp_link(part);
                    let start = this.get_node_by_id(link.start);
                    let finish = this.get_node_by_id(link.end);
                    start.outputs.push(link);
                    finish.inputs.push(link);
                }
            }
        }
    };

    get_node_by_id = function(id){
        for (let i = 0; i < this.structure.length; i++){
            for (let j = 0; j < this.structure[i].length; j++){
                if (this.structure[i][j].id === id)
                    return this.structure[i][j];
            }
        }
    };

    get_link_by_id = function(id){
        let start = id.substr(0, id.indexOf('-'));
        let node = get_node_by_id(start);
        return node.outputs.filter(l => l.id === id);
    };

    update_weights = function(data){
        let parts = data.split('\n');
        let sSizes = parts[0].substr(1, parts[0].length-1).split(',');
        let sizes = [];
        for (let sSize in sSizes){
            sizes.push(Number(sSize))
        }
        if ( this.structure.length === sizes.length && this.structure[0].length === Math.max(sizes)){
            for (let part in parts){
                if (part.substr(0,4) === "node"){
                    part = part.substr(5);
                    let id_bias = part.split("; ");
                    let node = this.get_node_by_id(id_bias[0]);
                    node.bias = Number(id_bias[1]);
                }
                else if (part.substr(0,4) === "link"){
                    part = part.substr(5);
                    let id_weight = part.split("; ");
                    let link = this.get_link_by_id(id_weight[0]);
                    link.weight = Number(id_weight[1])
                }
            }
        }
        else console.log("network shape error; reload network"); //todo кинуть ошибку
    };

    forwardProp = function(inputs){
        if (this.structure.length !== inputs.length)
            throw new Error("sizes do not correspond");

        for (let i = 0; i < this.structure[0].length; i++)
            this.structure[0][i].output = inputs[i];

        for (let layerIdx = 1; layerIdx < this.structure.length; layerIdx++)
            for (let i = 0; i < this.structure[layerIdx].length; i++)
                this.structure[layerIdx][i].updateOutput(); // todo прописать это

        return this.structure[this.structure.length - 1][0].output;
    };

    get_loss = function(test_set){
        let loss = 0;
        for (let point in test_set){
            let input = this.create_inputs(point);
            let output = this.forwardProp(input);
            loss += 0.5 * (output - point.val) * (output - point.val);
        }
        return loss/test_set.length;
    };

    create_inputs = function(point){
        let inputs = [];
        let input_ids = this.inputs.split(",");
        if (input_ids.includes("X"))
            inputs.push( point.x );
        if (input_ids.includes("Y"))
            inputs.push(point.y);
        if (input_ids.includes("X2"))
            inputs.push(point.x*point.x);
        if (input_ids.includes("Y2"))
            inputs.push(point.y*point.y);
        if (input_ids.includes("XY"))
            inputs.push(point.x*point.y);
        if (input_ids.includes("sX"))
            inputs.push(Math.sin(point.x));
        if (input_ids.includes("sY"))
            inputs.push(Math.sin(point.y));
        return inputs;
    }
}

class Rbf_node{
    constructor(data){
        if (typeof data === "string"){
            data = data.substr(14);

            let parts = data.split("; ");
            this.id = parts[0];
            this.weight = Number(parts[1]);
            this.X = Number(parts[2].substr(1));
            this.Y = Number(parts[3].substr(0, parts[3].length-1));
        }
    }
}

class Rbf{
    hidden = [];
    constructor(data){
        let neurons = data.split("\n");
        for (let neuron in neurons)
            hidden.push(Rbf_node(neuron));
    }
}