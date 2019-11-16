package ML.MLP;

import ML.Functions.ActivationFunction;

import java.util.ArrayList;
import java.util.List;

public class Neuron {
    String id;
    List<Link> inputLinks;
    double bias = 0.1;
    List<Link> outputLinks;
    double totalInput;

    double output;

    // error derivative with respect to this node's output
    double outputDeriv = 0;

    // error derivative with respect to this node's total input
    double inputDeriv = 0;

    /* accumulated error derivative with respect to this node's
     * total input since the last update. Equals dE/db, b is bias
     */
    double accInputDeriv = 0;

    // number of accumulated error derivatives with respect to
    // the total input since the last update
    int numAccDerivErrs = 0;

    ActivationFunction activation;

    public Neuron (String id, ActivationFunction activation,
                   boolean initZero){
        inputLinks = new ArrayList<>();
        outputLinks = new ArrayList<>();
        this.id = id;
        this.activation = activation;
        if (initZero)
            this.bias = 0;
    }

    /**
     * @return new output of the node
     */
    double updateOutput(){
        totalInput = bias;
        for (int i = 0; i < inputLinks.size(); i++){
            Link link = inputLinks.get(i);
            totalInput += link.weight*link.source.output;
        }
        output = activation.output(totalInput);
        return output;
    }
}
