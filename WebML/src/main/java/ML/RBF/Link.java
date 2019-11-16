package ML.RBF;

class Link {
    String id;
    Neuron source;
    Neuron dest;
    public double weight;


    Link(Neuron source, Neuron dest){
        id = source.id + " to " + dest.id;
        this.source = source;
        this.dest = dest;
        this.weight = 1d;
    }
}
