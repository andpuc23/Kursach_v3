from abc import abstractmethod, ABC
import numpy as np
from Points import PointsGenerator


class NetworkInterface(ABC):
    @abstractmethod
    def train(self, batch):
        pass

    @abstractmethod
    def structure(self):
        pass

    @abstractmethod
    def predict(self, points: list = None, point=None):
        pass

    def results(self):
        sz = PointsGenerator.POINTS_SIZE
        """returns an 2D-array with predictions for every point of field"""
        field = np.zeros(shape=[sz, sz], dtype=float)
        # field = np.zeros_like(PointsGenerator.POINTS_SIZE,
        #                       PointsGenerator.POINTS_SIZE,
        #                       dtype=float)
        for (x, y), _ in np.ndenumerate(field):
            field[x, y] = self.predict(point=
                                       PointsGenerator.Point
                                       (x=x, y=y, val=0)
                                       )

        return field
