from threading import Thread
from NeuralNetwork import MLP, NetworkInterface, RBF
from NeuralNetwork.MLP import Activations, Regularizations
from Points import PointsGenerator

from http.server import BaseHTTPRequestHandler, HTTPServer

HOST = '127.0.0.1'
PORT = 8080
MAX_LINE = 64*1024


class Learner(Thread):
    def __init__(self,  callback, network: NetworkInterface = None, batch_size=1):
        super().__init__()
        self.network = network
        self.batch_size = batch_size
        self.callback = callback

    def run(self):
        while True:
            self.callback.send_results(200, self.network.train(self.batch_size))


class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, request, client_address, server):
        super().__init__(request, client_address, server)
        self.learn_thread = Learner(self)
        self.generator = None
        self.network = None

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type,Request")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,'
                                                         'User-Agent,X-Requested-With,If-Modified-Since,'
                                                         'Cache-Control,Content-Type')
        # self.send_header("Connection", "Upgrade")
        # self.send_header("Sec_WebSocket-Accept")
        self.end_headers()

    def parse_request(self):
        self.requestline = self.raw_requestline[6:-11]
        print('request:', self.requestline)
        self.request_version = "HTTP/1.1"

        index = len("Request=")
        request = self.requestline[index:].decode('utf-8')

        self.command = request.split("%20")[0]
        self.parameters = request.split("%20")[1:]

        if any(start in self.command for start in ['get_points', 'train', 'create_network', 'update', 'send_header']):
            print("command:", self.command)
            print("parameters:", self.parameters)
            return True
        print("No command {} found".format(self.command))
        self.send_error(501, "internal error", "No command {}".format(self.command))
        return False

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
            # layer sizes
            layer_sizes = tuple(
                map(lambda a: int(a), parameters[0].split('%2C')))
            # activation function
            activation = None
            if parameters[1] in ['identity', 'relu', 'logistic', 'tanh']:
                sActivation = parameters[1]
                if sActivation == 'identity':
                    activation = Activations.LINEAR
                elif sActivation == 'relu':
                    activation = Activations.RELU
                elif sActivation == 'logistic':
                    activation = Activations.SIGMOID
                else:
                    activation = Activations.TANH

            learn_rate = float(parameters[2])

            regularization_rate = float(parameters[3])
            # regularization function
            regularization = None
            if parameters[4] in ['L1', 'L2']:
                if parameters[4] == 'L1':
                    regularization = Regularizations.L1
                else:
                    regularization = Regularizations.L2
            input_ids = []
            possible_ids = ['X', 'Y', "X2", "Y2", "XY", "sX", "sY"]
            for inp in parameters[5].split('%2C'):
                if inp in possible_ids:
                    input_ids.append(inp)
            self.network = MLP.MLP(layer_sizes,
                                   activation,
                                   Activations.LINEAR,
                                   learn_rate,
                                   regularization_rate,
                                   regularization,
                                   input_ids)
            print('inited network')
            return self.network.to_string()

        elif net_type == 'rbf':
            sigma = float(parameters[0])
            self.network = RBF.RBF(sigma)
            print('inited network')
            return self.network.to_string()

        else:
            self.send_error(500, "value error", "unknown network type")

    def send_results(self, message=None):
        self.send_response(200, message)
        self._send_cors_headers()
        self.wfile.write(message)
        print('sent', message)

    def check_entities(self):
        if self.network is None:
            self.send_error(412, 'No network', 'Neural network is not inited')
            return False
        if self.generator is None:
            self.send_error(412, 'No points', 'Points generator type is not selected')
            return False
        return True

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

    create_network mlp 4,2,5 relu 0.03 0 L1 X,Y,X2,sY - shape
    create_network rbf 0.237

    sends result of the actions
    # todo дописать док
    """

    def do_train(self):
        if self.check_entities():
            if self.parameters[0] == 'once':
                result = self.network.train(self.generator.get_point())
                self.send_results(result)
            elif self.parameters[0] == 'forever':
                self.learn_thread.run()
            elif self.parameters[0] == 'stop':
                self.learn_thread.join()
            else:
                self.send_error(500, "unknown command", "unknown parameter for command \'learn\'")

    def do_update(self):
        entity = self.parameters[0]
        shape = self.parameters[1:]
        if entity == 'points':
            result = self._init_generator(shape[0], shape[1:]).encode('utf-8')
            self.send_results(result)
        elif entity == 'network':
            result = self._init_network(shape[0], shape[1:]).encode('utf-8')
            self.send_results(result)
        else:
            self.send_error(500, 'unknown params', 'unknown {} param for \'update\' command'.format(entity))

    def do_get_points(self):
        if self.generator is None or self.generator.type() != self.parameters[1]:
            shape = self.parameters[1]
            if shape == 'circle':
                params = [50, 75, 100]
            elif shape == 'xor':
                params = [100]
            elif shape == 'spiral':
                params = [2]
            else:  # shape == 'cluster'
                params = [50, 50, -50, -50, 75]
            self._init_generator(shape, params)

        number = int(self.parameters[0])
        points = []
        for i in range(number):
            points.append(self.generator.get_point())

        response = ''
        for point in points:
            response += str(point)

        self.send_results(response.encode('utf-8'))


if __name__ == '__main__':

    httpd = HTTPServer((HOST, PORT), RequestHandler)
    print('server started at', HOST, PORT)
    httpd.serve_forever()
