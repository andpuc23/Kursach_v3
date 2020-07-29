from abc import abstractmethod, ABC
import numpy as np
from Points import PointsGenerator
import json


class NetworkInterface(ABC):
    @abstractmethod
    def train(self, batch) -> str:
        pass

    @abstractmethod
    def predict(self, point):
        pass

    @abstractmethod
    def to_string(self) -> str: pass

    def results(self):
        sz = PointsGenerator.POINTS_SIZE
        """returns an 2D-array with predictions for every point of field"""
        field = np.zeros(shape=[sz, sz], dtype=float)
        for (x, y), _ in np.ndenumerate(field):
            field[x, y] = self.predict(point=
                                       PointsGenerator.Point
                                       (x=x, y=y, val=0)
                                       )
        return field

    @abstractmethod
    def to_json(self):
        pass
