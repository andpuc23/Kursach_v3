package ML.MLP;

import ML.Functions.ActivationFunction;

public class InputNeuron extends Neuron {

    public InputNeuron(String id, ActivationFunction activation, boolean initZero) {
        super(id, activation, initZero);
        for (Link l: this.outputLinks) {
            l.weight = 1;
        }
    }
}
