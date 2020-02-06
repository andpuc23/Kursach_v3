from sklearn.neural_network import MLPClassifier
import numpy as np
from Points import *

import json


class MLP(MLPClassifier):
    def __init__(self,
                 alpha: float = 0.0001,
                 hidden_layer_sizes: tuple = None,
                 activation='relu',
                 learning_rate: float = 0.005,
                 momentum=0.9,
                 ):
        super().__init__()
        if hidden_layer_sizes is not None:
            self.hidden_layer_sizes = hidden_layer_sizes
        self.activation = activation
        self.solver = 'sgd'
        self.alpha = alpha
        self.learning_rate_init = learning_rate
        self.power_t = 0.5
        self.max_iter = 1e9
        self.tol = 0.
        self.momentum = momentum

    def structure(self):
        return json.dumps(self.get_params())


    def train(self, batch):
        """batch is an array (X, Y, val)"""
        self.partial_fit(batch[:, :2], batch[:, 2])

    def results(self):
        field = np.zeros_like(PointsGenerator.POINTS_SIZE,
                              PointsGenerator.POINTS_SIZE,
                              dtype=float)

        for x, y in np.ndenumerate(field):
            field[x, y] = self.predict([x, y])

        return field