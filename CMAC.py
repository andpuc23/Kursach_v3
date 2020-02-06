import numpy as np


class CMAC:

    train_params = {
        'epochs': 1,
        'tol': 1e-6,
        'start': 1
    }

    def __init__(self, r: int, x: int):
        self.ro = r
        mu1 = np.fix((x-1+r-1)/r)+1

        self.mu = mu1[:]
        self.xmax = r*(mu1[:]-1)+1
        c = [r, mu1]
        self.memory_size = np.prod(c)
        self.W = np.zeros(c)  # memory size

    def active(self, P):
        """returns numbers of active cells on input P"""
        c1 = np.fix((P-1)/self.ro)
        m = P-1 % self.ro
        c = np.zeros(self.ro, len(P[0]))
        mucp = self.ro*np.cumprod(self.mu[::-1]).T
        mucp = [1, mucp]
        mucp = mucp[::-1]
        for i in range(self.ro):
            c2 = c1 + (i < m)
            # c2 = c1 + 1 - (i < (self.ro-m))
            # c2 = c1 + (i >= (self.ro - m))
            c3 = mucp*c2 + 1
            c[i:] = c3 + i*self.mu[-1]
        return c

    def train(self, P, T):
        """network's training upon input P and output T"""

        net1 = self
        w = self.W
        for j in range(self.train_params['epochs']):
            for i in range(len(P[0])):
                c = self.active(P[:i])
                e = T[:i] - sum(w[c][0])
                w[c] += e/self.ro
            if j % 100 == 0:
                print(1, '%d\n', j)
            net1.W = w

        return net1

    def sim(self, P):
        """gives network's prediction for input P"""
        c = self.active(P)
        z = sum(self.W[c][0])
        return z
