from math import pi
from numpy.random import random_sample, random
from Points.Point import Point

POINTS_SIZE = 6  # size of the points' field


class Generator:
    def get_point(self):
        pass

    def get_batch(self, size):
        res = []
        for i in range(size):
            res.append(self.get_point())
        return res

    def type(self):
        pass


class SpiralsPoints(Generator):
    def __init__(self, coeff=2.0):
        self.coeff = coeff
        self.generate_first = True

    def get_point(self):
        k = random()*2.0*POINTS_SIZE
        ro = k * .75
        phi = ro * self.coeff

        self.generate_first = not self.generate_first
        if self.generate_first:
            return Point(ro=ro, phi=phi, val=1)
        else:
            return Point(ro=ro, phi=phi, val=-1)

    def type(self):
        return 'spiral'


class ClusterPoints(Generator):
    def __init__(self, xy1=(-POINTS_SIZE*2.0/3.0, -POINTS_SIZE*2.0/3.0),
                 xy2=(POINTS_SIZE*2.0/3.0, POINTS_SIZE*2.0/3.0),
                 size=POINTS_SIZE*.5):
        self.center1 = xy1
        self.center2 = xy2
        self.size = size
        self.generate_first = True

    def get_point(self):
        self.generate_first = not self.generate_first
        if self.generate_first:
            x = self.center1[0] + random() * 2 * self.size - self.size
            y = self.center1[1] + random() * 2 * self.size - self.size
            point = Point(x=x, y=y, val=1)
            if point.distance_to(self.center1) > self.size:
                return self.get_point()
            else:
                return point
        else:
            x = self.center2[0] + random() * 2 * self.size - self.size
            y = self.center2[1] + random() * 2 * self.size - self.size
            point = Point(x=x, y=y, val=-1)
            if point.distance_to(self.center2) > self.size:
                return self.get_point()
            else:
                return point

    def type(self):
        return 'cluster'


class XorPoints(Generator):
    def __init__(self, size=POINTS_SIZE):
        self.size = size

    def get_point(self):
        x = random() * 2 * self.size - self.size
        y = random() * 2 * self.size - self.size
        return Point(1 if x*y > 0 else -1, x=x, y=y)

    def type(self):
        return 'XOR'


class CirclePoints(Generator):
    def __init__(self, circle_radius=POINTS_SIZE*0.4,
                 ring_inner=POINTS_SIZE*0.7, ring_outer=POINTS_SIZE*0.9):
        self.circle_radius = circle_radius
        self.inner_radius = ring_inner
        self.outer_radius = ring_outer

    def get_point(self):
        ro = random_sample() * self.outer_radius
        while self.circle_radius < ro < self.inner_radius:
            ro = random_sample() * self.outer_radius

        phi = random_sample() * pi*2

        if ro < self.circle_radius:
            return Point(ro=ro, phi=phi, val=1)
        else:
            return Point(ro=ro, phi=phi, val=-1)

    def type(self):
        return 'circle'
