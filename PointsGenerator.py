from math import pi
from numpy.random import random_sample, randint
from Points.Point import Point

POINTS_SIZE = 100  # size of the points' field


class Generator:
    def get_point(self):
        pass


class PointsGenerator:
    def __init__(self, shape='circle',  # generated points' shape
                 circle_radius=75,  # circle only
                 ring_inner=100,  # circle only
                 ring_outer=125,  # circle only
                 size=POINTS_SIZE,  # size of area for points, for cluster & xor
                 xy1=(0, 0),  # 1-st cluster center
                 xy2=(0, 0),  # 2-nd cluster center
                 coeff=2  # spiral's speed of size increase
                 ):
        if shape == 'circle':
            self.generator = CirclePoints(circle_radius,
                                          ring_inner,
                                          ring_outer)

        elif shape == 'xor':
            self.generator = XorPoints(size)

        elif shape == 'cluster':
            self.generator = ClusterPoints(xy1, xy2, size)

        elif shape == 'spirals':
            self.generator = SpiralsPoint(coeff)

    def get_point(self):
        return self.generator.get_point()


class SpiralsPoint(Generator):
    def __init__(self, coeff: int):
        self.coeff = coeff
        self.generate_first = False

    def get_point(self):
        k = randint(0, 100)
        ro = k * .75
        phi = ro * self.coeff

        self.generate_first &= 1
        if self.generate_first:
            return Point(ro=ro, phi=phi, val=1)
        else:
            return Point(ro=ro, phi=phi, val=-1)


class ClusterPoints(Generator):
    def __init__(self, xy1: (int, int), xy2: (int, int), size):
        self.center1 = xy1
        self.center2 = xy2
        self.size = size
        self.generate_first = False

    def get_point(self):
        self.generate_first &= 1
        if self.generate_first:
            x = self.center1[0] + randint(-self.size, self.size)
            y = self.center1[1] + randint(-self.size, self.size)
            return Point(x=x, y=y, val=1)
        else:
            x = self.center2[0] + randint(-self.size, self.size)
            y = self.center2[1] + randint(-self.size, self.size)
            return Point(x=x, y=y, val=-1)


class XorPoints(Generator):
    def __init__(self, size):
        self.size = size

    def get_point(self):
        x = randint(-self.size, self.size+1)
        y = randint(-self.size, self.size+1)
        return Point(1 if x*y > 0 else -1, x=x, y=y)


class CirclePoints(Generator):
    def __init__(self, circle_radius,
                 ring_inner, ring_outer):
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
