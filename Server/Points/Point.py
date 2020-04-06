from math import cos, sin, atan2, sqrt


class Point:
    def get_cartesian(self):
        return self.X, self.Y

    def get_polar(self):
        ro = sqrt(self.X ** 2 + self.Y ** 2)
        phi = atan2(self.Y, self.X)
        return ro, phi

    def __init__(self, val, x=None, y=None, ro=None, phi=None):
        self.val = val
        if x is not None and y is not None:
            self.X = x
            self.Y = y
        else:
            self.X = int(ro*cos(phi))
            self.Y = int(ro*sin(phi))

    def distance_to(self, other):
        return sqrt((self.X - other.X)**2 + (self.Y-other.Y)**2)

    def __str__(self):
        return "{}, {}, {}\n".format(self.X, self.Y, self.val)
