package ML.RBF;

import Points.Point;

public class HiddenNeuron {
    public String id;

    public double sigma;
    public double weight;
    public int wX;
    public int wY;

    double distanceTo(Point p){
        return Math.sqrt((wX - p.getCartesian()[0]) * (wX - p.getCartesian()[0]) +
                (wY - p.getCartesian()[1]) * (wY - p.getCartesian()[1]));
    }

    // e^(-distance/sigma)
    double error(Point p) {
        return Math.exp(
                -1d*distanceTo(p)/sigma);
    }

    public HiddenNeuron(String id, double sigma, int[] coords){
        this.id = id;
        this.sigma = sigma;
        wX = coords[0];
        wY = coords[1];
    }

    double outputFor(Point p){
        return error(p)/sigma;
    }

    public String toString(){
        return "Hidden neuron " + id + "; sigma: " + sigma + "; w: (" + wX + ";" + wY + ")";
    }
}