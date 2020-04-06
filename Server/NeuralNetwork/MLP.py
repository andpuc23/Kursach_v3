import math
import random
import numpy as np
from NeuralNetwork.NetworkInterface import NetworkInterface
from Points import *


class InputFunction:
    def X(x:float, y:float): return x
    def Y(x:float, y:float): return y
    def X2(x:float, y:float): return x*x
    def Y2(x:float, y:float): return y*y
    def XY(x:float, y:float): return x*y
    def sX(x:float, y:float): return np.sin(x)
    def sY(x:float, y:float): return np.sin(y)

class ErrorFunction:
    def error(output: float, target: float) -> float: pass

    def der(output: float, target: float) -> float: pass


class ActivationFunction:
    def output(self, input: float) -> float: pass

    def der(self, input: float) -> float: pass


class RegularizationFunction:
    def output(weight: float): pass

    def der(weight: float): pass


class Errors:
    class SQUARE(ErrorFunction):
        def error(output: float, target): return 0.5*(output-target)**2

        def der(output: float, target): return output-target


class Activations:
    class TANH(ActivationFunction):
        def output(self, x: float): return math.tanh(x)

        def der(self, x: float):
            output = self.output(x)
            return 1 - output**2

    class RELU(ActivationFunction):
        def output(self, x: float): return max(0, x)

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
        def output(weight: float): return abs(weight)

        def der(weight: float):
            if weight > 0: return 1
            elif weight < 0: return -1
            else: return 0

    class L2(RegularizationFunction):
        def output(weight: float): return 0.5*weight*weight

        def der(weight: float): return weight


class Node:
    id: str
    input_links = []
    bias = 0.1
    outputs = []
    total_input: float
    output: float
    output_der = 0
    input_der = 0
    input_func: InputFunction

    # accumulated error derivative with respect to this node's total input
    # since the last update. Equals dE/db, b = bias
    acc_input_der = 0

    # number of accumulated error derivatives
    num_accumulated_ders = 0

    # activation function
    activation: ActivationFunction

    def __init__(self, id: str, activation):
        self.id = id
        self.activation = activation

    def update_output(self):
        self.total_input = self.bias
        for link in self.input_links:
            self.total_input += link.weight * link.source.output

        self.output = self.activation.output(self.total_input)
        return self.output

    def to_string(self):
        """returns string of format "node <self.id>; <self.bias>"
            required for data transfer to client"""
        return "node {}; {}".format(self.id, self.bias)


class Link:
    id: str
    source: Node
    dest: Node
    is_dead = False
    error_der = 0
    acc_error_der = 0
    num_accumulated_ders = 0
    regularization: Regularizations

    def __init__(self, source: Node, dest: Node, regularization):
        self.weight = random.random() - 0.5
        self.id = source.id + '-' + dest.id
        self.source = source
        self.dest = dest
        self.regularization = regularization

    def to_string(self):
        """returns string of format "link <i-j>; <self.weight>"
                    required for data transfer to client"""
        return "link {}; {}".format(self.id, self.weight)
                                                             

class MLP(NetworkInterface):
    def __init__(self,
                 network_shape: tuple,
                 activation: type(Activations.TANH),
                 output_activation: type(Activations.LINEAR),
                 learn_rate: float,
                 regul_rate: float,
                 regularization: type(Regularizations.L2),
                 input_ids: list,
                 ):
        self.learn_rate = learn_rate
        self.regularization_rate = regul_rate
        self.shape = network_shape
        layers_num = len(network_shape)
        self.network = []

        self.inputs = input_ids
        for layer_idx in range(layers_num):
            id = 1
            is_output = layer_idx == layers_num - 1
            is_input = layer_idx == 0
            current_layer = []
            self.network.append(current_layer)
            nodes_num = network_shape[layer_idx]
            for i in range(nodes_num):
                node_id = id
                id += 1

                node = Node(str(100*layer_idx + node_id), output_activation if is_output else activation)
                current_layer.append(node)
                if not is_input:
                    # add links to previous layer
                    for j in range(len(self.network[layer_idx-1])):
                        prev_node = self.network[layer_idx-1][j]
                        link = Link(prev_node, node, regularization)
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

    def back_propagation(self, target, error_func):
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

    def update_weights(self):
        learning_rate = self.learn_rate
        regularization_rate = self.regularization_rate
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

    def to_string(self):
        struct = '{}\n'.format(self.shape)
        struct += ",".join(self.inputs) + "\n"
        for i in range(len(self.network)):
            for node in self.network[i]:
                struct += node.to_string() + '\n'
                struct += '\n'.join([link.to_string() for link in node.input_links])

        print(struct)
        return struct

    def train(self, point: Point, learningRate: float = 0.03, regularizationRate: float = 0, ):
        """batch is an array of points"""

        self.forward_propagation(self.construct_input(point.get_cartesian()))
        self.back_propagation(point.val, Errors.SQUARE)
        self.update_weights()

        return self.to_string()

    def results(self):
        field = np.zeros_like(PointsGenerator.POINTS_SIZE,
                              PointsGenerator.POINTS_SIZE,
                              dtype=float)

        for x, y in np.ndenumerate(field):
            field[x, y] = self.predict(Point.Point(x=x, y=y, val=0))

        return field

    def predict(self, point):
        return self.forward_propagation(
            self.construct_input(
                point.get_cartesian()))

    def construct_input(self, X: tuple):
        inputs = []
        x = X[0]
        y = X[1]

        for id in self.inputs:
            if id == 'X':
                inputs.append(InputFunction.X(x, y))
            elif id == "Y":
                inputs.append(InputFunction.Y(x, y))
            elif id == "X2":
                inputs.append(InputFunction.X2(x, y))
            elif id == "Y2":
                inputs.append(InputFunction.Y2(x, y))
            elif id == "XY":
                inputs.append(InputFunction.XY(x, y))
            elif id == 'sX':
                inputs.append(InputFunction.sX(x, y))
            else:
                inputs.append(InputFunction.sY(x, y))
        return inputs