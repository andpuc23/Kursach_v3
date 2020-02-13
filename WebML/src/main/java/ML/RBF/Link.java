package ML.RBF;

class Link {
    String id;
//    HiddenNeuron source;
    String sourceId;
    OutputNeuron dest;
    public double weight;


    Link(HiddenNeuron source, OutputNeuron dest){
        id = source.id + " to Output";
        this.sourceId = source.id;
        this.dest = dest;
        this.weight = 1d;
    }
}
