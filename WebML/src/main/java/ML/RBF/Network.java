package ML.RBF;

import ML.Functions.Activations;
import Points.Point;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Network {
    Neuron inputX;
    Neuron inputY;
    List<Neuron> hiddenLayer = new ArrayList<Neuron>();
    private int currId;

    List<Point> trainingData;

    Neuron outputNeuron;
    public Network(List<Point> trainingData) {
        inputX = new Neuron("x", new Activations.Linear(), 1d);
        inputY = new Neuron("y", new Activations.Linear(), 1d);
        outputNeuron = new Neuron("out", new Activations.Linear(), 1d);
        currId = 1;
        this.trainingData = trainingData;
    }

    void addNeuron(Point farthest) {
        Neuron hidden = new Neuron(Integer.toString(currId++), new Activations.Sigmoid(), 1d);
        hiddenLayer.add(hidden);
        Link link = new Link(inputX, hidden);
        hidden.inputLinks.add(link);
        link = new Link(hidden, outputNeuron);
        hidden.outputLink = link;
        outputNeuron.inputLinks.add(link);

        hidden.wX = farthest.getCartesian()[0];
        hidden.wY = farthest.getCartesian()[1];

        double networkError = outputNeuron.error(farthest);
        int val = farthest.value;
        double sigma = hidden.error(farthest) * Math.log(val - networkError);

        hidden.sigma = sigma;
    }

    public void updateWeights(){
        //searching for farthest point from the network
        double error = 0d;
        Point farthest = trainingData.get(new Random().nextInt(trainingData.size()));
        for (Point p : trainingData){
            if (Math.abs(outputNeuron.error(p) - p.value) > error){
                error = Math.abs(outputNeuron.error(p));
                farthest = p;
            }
        }
        addNeuron(farthest);
    }

    double outputForPoint(Point p){
        inputX.output = (double)p.getCartesian()[0];
        inputY.output = (double)p.getCartesian()[1];

        return outputNeuron.output();
    }

    public boolean test(Point testCase){
        //value's sign equals output sign
        return outputForPoint(testCase) * testCase.value > 0; // signs of point's value and network's output
    }


    public String toString(){
        StringBuilder sb = new StringBuilder();
        sb.append("RBF NN, " + hiddenLayer.size() + "\n");
        for (Neuron n : hiddenLayer) {
            sb.append(n.toString());
        }
        sb.append("\n\n");
        return sb.toString();
    }
}

