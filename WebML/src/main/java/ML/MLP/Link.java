package ML.MLP;

class Link {
    String id;
    Neuron source;
    Neuron destination;
    double weight;

    //error derivative with respect to its weight
    double errorDeriv;

    //accumulated error derivative since the last update
    double accErrorDeriv;

    //number of accumulated derivatives since the last update
    int numAccDerivs;

    boolean isDead;

    RegularizationFunction regularization;

    Link(Neuron source, Neuron dest, RegularizationFunction reg, boolean initZero){
        id = source.id + " to " + dest.id;
        this.source = source;
        this.destination = dest;
        this.regularization = reg;
        this.isDead = false;
        if (initZero)
            this.weight = 0;
    }
}
