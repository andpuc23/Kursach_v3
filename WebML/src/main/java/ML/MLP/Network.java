package ML.MLP;

import ML.Functions.*;

public class Network {
    Neuron[][] network;

    /**
     * create multilayer perceptron
     * @param networkShape each value is num of neurons in layer
     * @param activation neuron's function: linear/relu/tanh/sigmoid
     * @param outputActivation last layer neuron's function
     * @param regularization regularization function of network
     * @param inputIds id's of 1st layer neurons
     * @param initZero initialize neuron's bias with 0d
     */
    public Network(int[] networkShape, ActivationFunction activation,
                   ActivationFunction outputActivation,
                   RegularizationFunction regularization, String[] inputIds,
                   boolean initZero){
        int numLayers = networkShape.length;
        int id = 1;
        network = new Neuron[numLayers][];

        for (int layerId = 0; layerId < numLayers; layerId++){
            boolean isOutputLayer = layerId == numLayers-1;
            boolean isInputLayer = layerId == 0;
            int numNeurons = networkShape[layerId];
            network[layerId] = new Neuron[numNeurons];

            for (int i = 0; i < numNeurons; i++){
                String neuronId = Integer.toString(id);

                if (isInputLayer)
                    neuronId = inputIds[i];
                else
                    id++;

                Neuron neuron = new Neuron(neuronId, isOutputLayer ? outputActivation : activation,
                        initZero);
                network[layerId][i] = neuron;

                // adding links from previous layers
                if (layerId >= 1){
                    for (int j = 0; j < network[layerId - 1].length; j++){
                        Neuron prev = network[layerId-1][j];
                        Link link = new Link(prev, neuron, regularization, initZero);
                        prev.outputLinks.add(link);
                        neuron.inputLinks.add(link);
                    }
                }
            }
        }
    }



    double forwardPropagation(double[] inputs){
        if (inputs.length != network[0].length)
            throw new IllegalArgumentException("inputs number and input " +
                    "layer size do not correspond");

        //updating input layer
        for (int i = 0; i < network[0].length; i++) {
            network[0][i].output = inputs[i];
        }

        for (int layerId = 1; layerId < network.length; layerId++){
            for (int i = 0; i < network[layerId].length; i++){
                network[layerId][i].updateOutput();
            }
        }
        return network[network.length - 1][0].output;
    }

    void backPropagation(double target, ErrorFunction errorFunc) {
        Neuron outputNode = network[network.length-1][0];
        outputNode.outputDeriv = errorFunc.der(outputNode.output, target);

        for (int layerId = network.length-1; layerId >= 0; layerId--){
            //computing each neuron's error derivative
            for (int i = 0; i < network[layerId].length; i++){
                Neuron neuron = network[layerId][i];
                neuron.inputDeriv = neuron.outputDeriv * neuron.activation.der(neuron.totalInput);
                neuron.accInputDeriv += neuron.inputDeriv;
                neuron.numAccDerivErrs++;
            }

            for (int i = 0; i < network[layerId].length; i++){
                Neuron n = network[layerId][i];
                for (int j = 0; j < n.inputLinks.size(); i++){
                    Link link = n.inputLinks.get(j);
                    if (link.isDead)
                        continue;

                    link.errorDeriv = n.inputDeriv*link.source.output;
                    link.accErrorDeriv += link.errorDeriv;
                    link.numAccDerivs++;
                }
            }
            if (layerId == 1)
                continue;
            for (int i = 0; i < network[layerId-1].length; i++){
                Neuron n = network[layerId-1][i];

                n.outputDeriv = 0;
                for (int j = 0; j < n.outputLinks.size(); j++){
                    Link output = n.outputLinks.get(j);
                    n.outputDeriv += output.weight * output.destination.inputDeriv;
                }
            }
        }
    }


    void updateWeights(double learningRate, double regularizationRate){
        for (int layerId = 1; layerId < network.length; layerId++){
            for (int i = 0; i < network[layerId].length; i++){
                Neuron node = network[layerId][i];
                //update bias
                if (node.numAccDerivErrs > 0){
                    node.bias -= learningRate * node.accInputDeriv / node.numAccDerivErrs;
                    node.accInputDeriv = 0d;
                    node.numAccDerivErrs = 0;
                }

                for (int j = 0; j < node.inputLinks.size(); j++){
                    Link link = node.inputLinks.get(j);
                    if (link.isDead)
                        continue;

                    double regularizationDeriv = link.regularization == null ? 0 :
                            link.regularization.der(link.weight);

                    if (link.numAccDerivs > 0) //update weight
                        link.weight -= (learningRate / link.numAccDerivs) * link.accErrorDeriv;

                    double newLinkWeight = link.weight - (learningRate * regularizationRate) * regularizationDeriv;
                    if (link.regularization instanceof Regularizations.L1 &&
                    link.weight * newLinkWeight < 0){
                        link.weight = 0;
                        link.isDead = true;
                    } else {
                        link.weight = newLinkWeight;
                    }
                    link.accErrorDeriv = 0d;
                    link.numAccDerivs = 0;
                }
            }
        }
    }
}
