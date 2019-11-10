package ML.MLP;

public class MLP {
    Neuron[][] network;

    //TODO добавить прокидывание ссылок не все ко всем, а выборочно
    public MLP(int[] networkShape, ActivationFunction activation,
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
                    Link l = node.inputLinks.get(j);
                    if (l.isDead)
                        continue;

                    double regularizationDeriv = l.regularization == null ? 0 :
                            l.regularization.der(l.weight);

                    if (l.numAccDerivs > 0) //update weight
                        l.weight -= (learningRate / l.numAccDerivs) * l.accErrorDeriv;

                    double newLinkWeight = l.weight - (learningRate * regularizationRate) * regularizationDeriv;
                    if (l.regularization  instanceof Regularizations.L1 &&
                    l.weight * newLinkWeight < 0){
                        l.weight = 0;
                        l.isDead = true;
                    } else {
                        l.weight = newLinkWeight;
                    }
                    l.accErrorDeriv = 0d;
                    l.numAccDerivs = 0;
                }
            }
        }
    }
}
