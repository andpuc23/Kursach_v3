package ML.RBF;

class Link {
    String id;
    HiddenNeuron source;
    OutputNeuron dest;
    public double weight;


    Link(HiddenNeuron source, OutputNeuron dest){
        id = source.id + " to " + dest.id;
        this.source = source;
        this.dest = dest;
        this.weight = 1d;
    }
}
