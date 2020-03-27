import numpy as np
from NeuralNetwork.NetworkInterface import NetworkInterface


class CMAC(NetworkInterface):
    def __init__(self, r: int, x: int):
        self.ro = r  # number of parameters remembered
        # x is max coordinate value net can remember
        a = np.fix((x-1+r-1)/r)+1
        mu1 = [a, a]

        self.mu = mu1[:]
        self.xmax = r*([lambda x: x-1 for x in self.mu])
        self.xmax = [lambda x: x+1 in self.xmax]

        c = [r]
        for x in mu1: c.append(x)

        self.memory_size = np.prod(c)
        for i in range(len(c)):
            c[i] = int(c[i])
        self.W = np.zeros(tuple(c))  # memory

    def active(self, P):
        """returns numbers of active cells on input P"""
        c1 = []
        # for

    def train(self, points: list):
        """network's training upon input P and output T"""
        P = list()
        T = list()
        for p in points:
            P.append(p.get_cartesian())
            T.append(p.val)

        net1 = self
        w = self.W
        for i in range(len(P)):
            c = self.active(P[i])
            e = T[i] - sum(w[c][0])
            w[c] += e/self.ro
        net1.W = w

        return net1

    def predict(self, P=None, points=None):
        """gives network's prediction for input P"""
        if points is None:
            c = self.active(P)
            z = sum(self.W[c][0])
            return z
        else:
            res = []
            for P in points:
                res.append(self.predict(P))
            return res

    def structure(self):
        return self.W

