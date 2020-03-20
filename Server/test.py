from NeuralNetwork import RBF, CMAC
from Points import PointsGenerator

nn = RBF.RBF(0.05)
# nn = CMAC.CMAC(4, 100)

# gen = PointsGenerator.SpiralsPoints(2)
# gen = PointsGenerator.ClusterPoints((-35, -35), (35, 35), 50)
gen = PointsGenerator.XorPoints()


def test():
    success = 0
    for j in range(100):
        points = gen.get_batch(10)
        for point in points:
            # print(point.val, '{:.2}'.format(nn.predict(point)))
            if nn.predict(point) * point.val > 0:
                success += 1
    print(success / 10, f'% at {i} neurons')


for i in range(1, 101):
    points = gen.get_batch(10)
    nn.train(points)
    if i % 10 == 0:
        test()
