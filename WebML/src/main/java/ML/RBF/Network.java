package ML.RBF;

import Points.*;
import java.util.ArrayList;
import java.util.List;

public class Network {
    private int currId;

    double neuronSigma;
    List<HiddenNeuron> hiddenLayer = new ArrayList<>();
    OutputNeuron output;
    PointsGenerator data;

    public Network(double neuronSigma, PointsGenerator data) {
        output = new OutputNeuron();
        currId = 1;
        this.neuronSigma = neuronSigma;
        this.data = data;
    }

    public void addNeuron() {
        Point point = data.getPoint();
        HiddenNeuron hn = new HiddenNeuron(Integer.toString(currId++), neuronSigma,
                point.getCartesian());

        hiddenLayer.add(hn);
        Link link = new Link(hn, output);
        link.weight = 0d;
        double err = point.value - this.outputForPoint(point);

        //adjust link's weight
        link.weight = err;
        output.inputs.add(link);
    }

    double outputForPoint(Point p){
        return output.outputFor(p);
    }

    public boolean test(Point testCase){
        return outputForPoint(testCase) * testCase.value > 0; // signs of point's value and network's output
    }


    public String toString(){
        StringBuilder sb = new StringBuilder();
        sb.append("RBF NN, " + hiddenLayer.size() + "\n");

        sb.append("last neuron: " + hiddenLayer.get(hiddenLayer.size()-1).toString() + "; ");

        sb.append("weight: " + output.inputs.get(output.inputs.size()-1).weight);

        return sb.toString();
    }
}

