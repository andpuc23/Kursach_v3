from Learner import Learner
from NeuralNetwork import *
import asyncio
from Points import PointsGenerator


class Server(asyncio.Protocol):
    generator = None
    network = None
    learn_thread = Learner()

    @staticmethod
    def run_server(host, port):
        loop = asyncio.get_event_loop()
        coroutine = loop.create_server(
            Server, host, port
        )
        server = loop.run_until_complete(coroutine)
        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
        server.close()
        loop.run_until_complete(server.wait_closed())
        loop.close()

    def _init_generator(self, gen_type, parameters):
        if gen_type == 'circle':
            circle_rad = int(parameters[0])
            in_rad = int(parameters[1])
            out_rad = int(parameters[2])

            self.generator = PointsGenerator.CirclePoints(
                circle_radius=circle_rad,
                ring_inner=in_rad,
                ring_outer=out_rad)

        elif gen_type == 'spiral':
            coeff = float(parameters[0])
            self.generator = PointsGenerator.SpiralsPoints(coeff)

        elif gen_type == 'xor':
            sz = int(parameters[0])
            self.generator = PointsGenerator.XorPoints(sz)

        elif gen_type == 'cluster':
            xy1 = (int(parameters[0]), int(parameters[1]))
            xy2 = (int(parameters[2]), int(parameters[3]))
            size = int(parameters[4])
            self.generator = PointsGenerator.ClusterPoints(xy1, xy2, size)

        else:
            raise ValueError("unknown points generator type")

    def _init_network(self, net_type, parameters):
        if net_type == 'mlp':
            alpha = float(parameters[0])
            layer_sizes = tuple(
                map(lambda a: int(a), parameters[1].split(',')))
            if parameters[2] in ['identity', 'relu', 'logistic', 'tanh']:
                activation = parameters[2]
            else: activation = None
            learn_rate = float(parameters[3])
            moment = float(parameters[4])

            self.network = MLP.MLP(alpha, layer_sizes,
                                   activation,
                                   learn_rate, moment)
        elif net_type == 'cmac':
            r = int(parameters[0])
            x = int(parameters[1])

            self.network = CMAC.CMAC(r, x)

        elif net_type == 'rbf':
            sigma = float(parameters[0])
            self.network = RBF.RBF(sigma)

        else:
            raise ValueError("unknown network type")

    def process_data(self, data):
        """
        REQUEST FORMAT
        get_points <number> <shape>
        train <period>
        create_network <type> <parameters>
        update <what to update>

        period = once/forever/stop
        shape = circle/xor/cluster/spiral
        what to update = network/points

        EXAMPLES:
        get_points 10 circle 75 100 125 - circle radius, ring radiuses
        get_points 15 spiral 2 - coeff
        get_points 27 xor 100 - size
        get_points 13 cluster 50 50 -50 -50 75 - (x1, y1), (x2, y2), size

        todo дописать док
        """

        request = data.split(' ')
        command = request[0]

        if command == 'get_points':
            if self.generator is None:
                gen_type = request[2]
                params = request[3:]

                self._init_generator(gen_type, params)

            points = []
            for i in range(int(request[1])):
                points.append(self.generator.get_point())

            return "ok\n" + str(points)

        elif command == 'train':
            if self.network is None:
                return "error\nno network selected"

            period = request[1]
            if period == 'once':
                self.network.train(self.generator.get_point())
            elif period == 'forever':
                self.learn_thread.run()
            elif period == 'stop':
                self.learn_thread.join()

        elif command == 'update':
            entity = request[1]
            if entity == 'points':
                self.generator = None
            elif entity == 'network':
                self.network = None

        elif command == 'create_network':
            self._init_network(request[1], request[2:])

        else:
            return "error\nunknown command"

    def connection_made(self, transport):
        self.transport = transport

    def data_received(self, data):
        response = self.process_data(data.decode())

        self.transport.write(response.encode())
