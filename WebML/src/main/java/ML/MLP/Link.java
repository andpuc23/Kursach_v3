package ML.MLP;

import ML.Functions.RegularizationFunction;

public class Link {
    String id;
    Neuron source;
    Neuron destination;
    public double weight;

    //error derivative with respect to its weight
    double errorDeriv;

    //accumulated error derivative since the last update
    double accErrorDeriv;

    //number of accumulated derivatives since the last update
    int numAccDerivs;

    boolean isDead;

    RegularizationFunction regularization;

    /**
     *
     * @param source link start
     * @param dest link finish
     * @param reg regularization function - L1 of L2
     * @param initZero if link weight is 0
     */
    public Link(Neuron source, Neuron dest, RegularizationFunction reg, boolean initZero){
        id = source.id + " to " + dest.id;
        this.source = source;
        this.destination = dest;
        this.regularization = reg;
        this.isDead = false;
        if (initZero)
            this.weight = 0d;
    }
}
