import math
import random
import numpy as np
from NeuralNetwork.NetworkInterface import NetworkInterface
from Points import *
import json


class ErrorFunction:
    def error(self, output, target): pass

    def der(self, output, target): pass


class ActivationFunction:
    def output(self, input) -> float: pass

    def der(self, input) -> float: pass


class RegularizationFunction:
    def output(self, weight): pass

    def der(self, weight): pass


class Errors:
    class SQUARE(ErrorFunction):
        def error(self, output, target): return 0.5*(output-target)**2

        def der(self, output, target): return output-target


class Activations:
    class TANH(ActivationFunction):
        def output(self, x): return math.tanh(x)

        def der(self, x):
            output = self.output(x)
            return 1 - output**2

    class RELU(ActivationFunction):
        def output(self, x): return max(0, x)

        def der(self, x): return 1 if x > 0 else 0

    class SIGMOID(ActivationFunction):
        def output(self, x): return 1/(1+math.exp(-x))

        def der(self, x):
            output = self.output(x)
            return output*(1 - output)

    class LINEAR(ActivationFunction):
        def output(self, input): return input

        def der(self, input): return 1


class Regularizations:
    class L1(RegularizationFunction):
        def output(self, weight): return abs(weight)

        def der(self, weight):
            if weight > 0: return 1
            elif weight < 0: return -1
            else: return 0

    class L2(RegularizationFunction):
        def output(self, weight): return 0.5*weight*weight

        def der(self, weight): return weight


class Node:
    id: str
    input_links = []
    bias = 0.1
    outputs = []
    total_input: float
    output: float
    output_der = 0
    input_der = 0

    # accumulated error derivative with respect to this node's total input
    # since the last update. Equals dE/db, b = bias
    acc_input_der = 0

    # number of accumulated error derivatives
    num_accumulated_ders = 0

    # activation function
    activation: ActivationFunction

    def __init__(self, id, activation, init_zero):
        self.id = id
        self.activation = activation
        if init_zero:
            self.bias = 0

    def update_output(self):
        self.total_input = self.bias
        for link in self.input_links:
            self.total_input += link.weight * link.source.output

        self.output = self.activation.output(self.total_input)
        return self.output


class Link:
    id: str
    source: Node
    dest: Node
    is_dead = False
    error_der = 0
    acc_error_der = 0
    num_accumulated_ders = 0
    regularization: Regularizations

    def __init__(self, source: Node, dest: Node, regularization, init_zero):
        self.weight = random.random() - 0.5
        self.id = source.id + '-' + dest.id
        self.source = source
        self.dest = dest
        self.regularization = regularization
        if init_zero:
            self.weight = 0
                                                             

class MLP(NetworkInterface):
    def __init__(self,
                 network_shape: list,
                 activation: ActivationFunction,
                 output_activation: ActivationFunction,
                 regularization: RegularizationFunction,
                 input_ids: list,
                 init_zero
                 ):
        layers_num = len(network_shape)
        id = 1
        self.network = []
        for layer_idx in range(layers_num):
            is_output = layer_idx == layers_num - 1
            is_input = layer_idx == 0
            current_layer = []
            self.network.append(current_layer)
            nodes_num = network_shape[layer_idx]
            for i in range(nodes_num):
                node_id = str(id)
                if is_input:
                    node_id = input_ids[i]
                else:
                    id += 1

                node = Node(node_id, output_activation if is_output else activation, init_zero)
                current_layer.append(node)
                if not is_input:
                    # add links to previous layer
                    for j in range(len(self.network[layer_idx-1])):
                        prev_node = self.network[layer_idx-1][j]
                        link = Link(prev_node, node, regularization, init_zero)
                        prev_node.outputs.append(link)
                        node.input_links.append(link)

    def forward_propagation(self, inputs: list) -> float:
        input_layer = self.network[0]
        if len(inputs) != len(input_layer):
            raise AssertionError("inputs number does not correspond for network's input layer size")

        for layer_idx in range(1, len(self.network)):
            current_layer = self.network[layer_idx]
            for node in current_layer:
                node.update_output()
        return self.network[-1][0].output

    def back_propagation(self, target, error_func:ErrorFunction):
        output_node = self.network[-1][0]
        output_node.output_der = error_func.der(output_node.output, target)

        for layer_idx in reversed(range(len(self.network))):
            current_layer = self.network[layer_idx]
            for node in current_layer:
                node.input_der = node.output_der * node.activation.der(node.total_input)
                node.acc_input_der += node.input_der
                node.num_accumulated_ders += 1

            for node in current_layer:
                for link in node.input_links:
                    if link.is_dead: continue

                    link.error_der = node.input_der * link.source.output
                    link.acc_error_der += link.error_der
                    link.num_accumulated_ders += 1
                    
            if layer_idx == 1: continue

            prev_layer = self.network[layer_idx-1]
            for node in prev_layer:
                node.output_der = 0
                for output in node.outputs:
                    node.output_der += output.weight * output.dest.input_der

    def update_weights(self, learning_rate: float, regularization_rate: float):
        for current_layer in self.network:
            for node in current_layer:
                if node.num_accumulated_ders > 0:
                    node.bias -= learning_rate * node.acc_input_der / node.num_accumulated_ders
                    node.acc_input_der = 0
                    node.num_accumulated_ders = 0

                for link in node.input_links:
                    if link.is_dead: continue

                    regul_der = link.regularization.der(link.weight) \
                        if link.regularization is not None \
                        else 0

                    new_link_weight = link.weight - learning_rate*regularization_rate*regul_der

                    if link.regularization is Regularizations.L1 and link.weight*new_link_weight == 0:
                        link.weight = 0
                        link.is_dead = True
                    else:
                        link.weight = new_link_weight

                    link.acc_error_der = 0
                    link.num_accumulated_ders = 0

    def train(self, batch):
        """batch is an array of points"""
        X = list()
        y = list()
        for p in batch:
            X.append(p.get_cartesian())
            y.append(p.val)

        self.partial_fit(X, y)

    def results(self):
        field = np.zeros_like(PointsGenerator.POINTS_SIZE,
                              PointsGenerator.POINTS_SIZE,
                              dtype=float)

        for x, y in np.ndenumerate(field):
            field[x, y] = self.predict([x, y])

        return field

    def predict(self, point=None, points=None):
        if point is not None:
            return super().predict(point.get_cartesian())

        else:
            res = []
            for point in points:
                res.append(super().predict(point.get_cartesian()))
            return res
