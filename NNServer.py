import http.client
import json
from NeuralNetwork import MLP, RBF
from NeuralNetwork.MLP import Activations, Regularizations
from Points import PointsGenerator

from http.server import BaseHTTPRequestHandler, HTTPServer


HOST = '127.0.0.1'
PORT = 8080
MAX_LINE = 64*1024

networks = {} # id->network
generator = None


class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, request, client_address, server):
        super().__init__(request, client_address, server)

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type,Request")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,'
                                                         'User-Agent,X-Requested-With,If-Modified-Since,'
                                                         'Cache-Control,Content-Type')
        self.end_headers()

    def parse_request(self):
        self.request_version = 'HTTP/1.1'
        if self.raw_requestline[0:4] == b'POST':
            self.requestline = self.raw_requestline[6:-11]
            self.command = "POST"
        else: # raw_requestline[0:3] == b'GET'
            self.requestline = self.raw_requestline[5:-11]
            self.command = "GET"
        print('request:', self.requestline)

        request = self.requestline.decode('utf-8')
        self.headers = http.client.parse_headers(self.rfile, _class=self.MessageClass)

        self.parameters = request.split(" ")
        return True

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
        __id = generate_id(networks)
        if net_type == 'mlp':
            # layer sizes
            layer_sizes = tuple(parameters[0])
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
            input_ids = parameters[5]
            batch = int(parameters[6])
            net = MLP.MLP(layer_sizes, activation,
                          Activations.LINEAR, learn_rate,
                          regularization_rate, regularization, input_ids, batch)
            networks[__id] = net
            print('inited network')
            return __id

        elif net_type == 'rbf':
            sigma = float(parameters)
            net = RBF.RBF(sigma)
            networks[__id] = net
            print('inited network')
            return __id

        else:
            self.send_error(500, "value error", "unknown network type")

    def send_results(self, message=None):
        self.send_response(200, message)
        self._send_cors_headers()
        self.wfile.write(message)
        try:
            message = message.decode('utf-8')
        except Exception:
            print("exception while decoding")
        if len(message) > 200:
            print('sent', message[0:200])
        else:
            print('sent' + message)

    def check_entities(self):
        if not networks:
            self.send_error(412, 'No network', 'Neural network is not inited')
            return False
        if generator is None:
            self.send_error(412, 'No points', 'Points generator type is not selected')
            return False
        return True

    """
    GET
        пустой - ответ: index.html
        styles.css - ответ: файл
        ...
    POST
        init - получить параметры сети, создать сеть, одна эпоха обучения, вернуть сеть и id сети
        get_values - получить id cети, сверяем с текущей сетью, если совпадают - 1 эпоха, вернуть сеть. Иначе - вернуть ошибку
        reset - получить id, по нему удалить нейросеть
    """
    def send_file(self, file):
        try:
            with open("../WebFace/" + file, 'r') as f:
                self.send_results(f.read().encode('utf-8'))
        except IOError as e:
            print(e)
            self.send_error(404, "page not found")

    def do_GET(self):
        if self.parameters == ['']:
            self.send_file('index.html')
            return

        if self.parameters[0][-3:] == 'css':
            self.send_file(self.parameters[0])
            return

        if self.parameters[0][-2:] == 'js':
            self.send_file(self.parameters[0])
            return

        if self.parameters[0] == 'favicon.ico':
            self.send_file('favicon.ico')
            return

        else:
            self.send_error(501, "not implemented")
            return

        # one user can generate only 1 network of each type todo
    def do_POST(self):
        content_length = int(self.headers['content-length'])

        post_body = self.rfile.read(content_length).decode('utf-8')
        self.parameters = json.loads(post_body)

        if "init" in self.requestline.decode('utf-8'):
            if "datasetName" in self.parameters.keys():
                if self.parameters["datasetName"] == 'classifyCircleData':
                    generator = PointsGenerator.CirclePoints()
                elif self.parameters["datasetName"] == 'classifySpiralData':
                    generator = PointsGenerator.SpiralsPoints()
                elif self.parameters['datasetName'] == 'classifyTwoGaussData':
                    generator = PointsGenerator.ClusterPoints()
                elif self.parameters['datasetName'] == 'classifyXORData':
                    generator = PointsGenerator.XorPoints()
                else:
                    self.send_error(500, 'wrong params', 'dataset name or params can\'t be parsed')

            if 'sigma' in self.parameters.keys():
                new_net_id = self._init_network('rbf', self.parameters['sigma'])

            elif 'learningRate' in self.parameters.keys():
                inputs = []
                if self.parameters['x']:
                    inputs.append('X')
                if self.parameters['y']:
                    inputs.append('Y')
                if self.parameters['xTimesY']:
                    inputs.append('XY')
                if self.parameters['xSquared']:
                    inputs.append('X2')
                if self.parameters['ySquared']:
                    inputs.append('Y2')
                if self.parameters['sinX']:
                    inputs.append('sX')
                if self.parameters['sinY']:
                    inputs.append('sY')

                new_net_id = self._init_network('mlp', [[len(inputs)] + self.parameters['networkShape'] + [1],
                                           self.parameters['activation'], self.parameters['learningRate'],
                                           self.parameters['regularizationRate'],
                                           self.parameters['regularization'], inputs, self.parameters['batchSize']])

            networks[new_net_id].train(generator.get_point(networks[new_net_id].number % 2 == 0))

            if networks[new_net_id] is RBF:
                self.send_results((networks[new_net_id].to_full_json() + '\n' + str(new_net_id)).encode('utf-8'))
            else:
                self.send_results((networks[new_net_id].to_json() + '\n' + str(new_net_id)).encode('utf-8'))


        elif "get_values" in self.requestline.decode('utf-8'):
            net_id = int(self.parameters['id'])
            if net_id not in networks.keys():
                self.send_error(500, "wrong network id")
                return

            if "datasetName" in self.parameters.keys():
                if self.parameters["datasetName"] == 'classifyCircleData':
                    generator = PointsGenerator.CirclePoints()
                elif self.parameters["datasetName"] == 'classifySpiralData':
                    generator = PointsGenerator.SpiralsPoints()
                elif self.parameters['datasetName'] == 'classifyTwoGaussData':
                    generator = PointsGenerator.ClusterPoints()
                elif self.parameters['datasetName'] == 'classifyXORData':
                    generator = PointsGenerator.XorPoints()
                else:
                    self.send_error(500, 'wrong params', 'dataset name or params can\'t be parsed')

            networks[net_id].train(generator.get_point(networks[net_id].number % 2 == 0))
            self.send_results(networks[net_id].to_json().encode('utf-8'))
            # self.send_results(id)  # - если надо возвращать id, эта строчка тоже нужна

        elif "reset" in self.requestline.decode('utf-8'):
            net_id = int(self.parameters['id'])
            if net_id not in networks.keys():
                self.send_error(500, "wrong network id")
                return
            del networks[net_id]
            self.send_results("network was deleted".encode('utf-8'))


def generate_id(dictionary: dict):
    for i in range(10050000000):
        if i not in dictionary.keys():
            return i


if __name__ == '__main__':
    httpd = HTTPServer((HOST, PORT), RequestHandler)
    print('server started at', HOST, PORT)
    httpd.serve_forever()
