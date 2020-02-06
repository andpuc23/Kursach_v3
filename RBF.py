from math import exp, sqrt
from  Points import *


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
        return "hidden neuron {}; sigma: {};" \
               "coords:({};{})". \
            format(self.id, self.sigma,
                   self.wX, self.wY)

    def error(self, p: Point):
        return exp(-1. * self.distance_to(p) / self.sigma)

    def distance_to(self, p: Point):
        return sqrt((self.wX - p.X) ** 2 + (self.wY - p.Y) ** 2)

    def output_for(self, p: Point):
        return self.error(p) / self.sigma


class RBF:
    __curr_id = 1

    def __init__(self,
                 neuron_sigma,
                 generator: PointsGenerator):
        self.neuron_sigma = neuron_sigma
        self.hidden_neurons = []
        self.data = generator

    def add_neuron(self):
        point = self.data.get_point()
        neuron = Neuron(self.__curr_id, self.neuron_sigma, point.get_cartesian())
        self.hidden_neurons.append(neuron)

        err = point.val - self.output_for_point(point)

        neuron.weight = err

    def output_for_point(self, p: Point):
        sum_ = 0.
        for neuron in self.hidden_neurons:
            sum_ += neuron.error(p) * neuron.weight
        return sum_

