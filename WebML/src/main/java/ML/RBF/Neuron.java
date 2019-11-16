package ML.RBF;

import ML.Functions.ActivationFunction;
import Points.Point;

import java.util.ArrayList;
import java.util.List;

public class Neuron {
    String id;
    double sigma;
    List<Link> inputLinks;
    Link outputLink;
    ActivationFunction activationFunction;

    int wX;
    int wY;

    double totalInput(){
        double sum = 0;
        for (Link l : inputLinks) {
            sum += l.source.output()*l.weight;
        }
        return sum;
    }

    double distanceTo(Point p){
        return ((wX - p.getCartesian()[0]) * (wX - p.getCartesian()[0]) +
                (wY - p.getCartesian()[1]) * (wY - p.getCartesian()[1]));
    }

    double error(Point p) {
        return Math.exp(
                distanceTo(p)/sigma);
    }

    public Neuron(String id, ActivationFunction af, double sigma){
        inputLinks = new ArrayList<>();
        activationFunction = af;
        this.id = id;
        this.sigma = sigma;
    }

    double output(){
        if (!output.equals(Double.NEGATIVE_INFINITY))
            return output;
        return Math.exp(totalInput()/sigma);
    }

    public Double output = Double.NEGATIVE_INFINITY; //for input layer

    public String toString(){
        return "neuron " + id + "; weight: " + sigma + "; w: (" + wX + ";" + wY + ")\n";
    }
}