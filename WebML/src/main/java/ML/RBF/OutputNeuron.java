package ML.RBF;

import java.util.ArrayList;
import java.util.List;

public class OutputNeuron {
    List<HiddenNeuron> inputs;
    String id;

    public OutputNeuron(){
        inputs = new ArrayList<>();
    }

    @Override
    public String toString(){
        return "Output neuron, links no.:" + inputs.size();
    }
}
