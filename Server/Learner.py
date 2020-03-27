from threading import Thread
from NeuralNetwork.NetworkInterface import NetworkInterface


class Learner(Thread):
    def __init__(self, network: NetworkInterface = None, batch_size=1):
        super().__init__()
        self.network = network
        self.batch_size = batch_size

    def run(self):
        self.network.train(self.batch_size)
        while True:
            self.network.train(self.batch_size)
