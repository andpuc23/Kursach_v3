from math import exp, sqrt

from NeuralNetwork.NetworkInterface import NetworkInterface
from Points import *


class Neuron:
    def __init__(self,
                 id_: str,
                 sigma: float,
                 x, y
                 ):
        self.id = id_
        self.sigma = sigma
        self.wX, self.wY = x, y
        self.weight = 0

    def __str__(self):
        return "hidden neuron {}; {}; " \
               "({}; {})". \
            format(self.id, self.weight,
                   self.wX, self.wY)

    def error(self, p: Point):
        return exp(-1. * self.distance_to(p) / self.sigma)

    def distance_to(self, p: Point):
        return sqrt((self.wX - p.X) ** 2 + (self.wY - p.Y) ** 2)

    def output_for(self, p: Point):
        return self.error(p) / self.sigma


class RBF(NetworkInterface):
    def to_string(self) -> str:
        structure = 'rbf\n{}'.format(self.neuron_sigma)
        for neuron in self.hidden_neurons:
            structure += str(neuron) + '\n'

        print(structure)
        return structure

    __curr_id = 1

    def __init__(self,
                 neuron_sigma):
        self.neuron_sigma = neuron_sigma
        self.hidden_neurons = []

    def add_neuron(self, point):
        neuron = Neuron(str(self.__curr_id), self.neuron_sigma, *point.get_cartesian())
        self.hidden_neurons.append(neuron)
        self.__curr_id += 1

        err = point.val - self.output_for_point(point)

        neuron.weight = err

    def output_for_point(self, p: Point):
        sum_ = 0.
        for neuron in self.hidden_neurons:
            sum_ += neuron.error(p) * neuron.weight
        return sum_

    def train(self, points: list):
        for point in points:
            self.add_neuron(point)

    def predict(self, point=None, points=None):
        if points is None:
            return self.output_for_point(point)
        else:
            res = []
            for point in points:
                res.append(self.output_for_point(point))

            return res
