import Points
import NeuralNetwork
import asyncio


class Server(asyncio.Protocol):
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

    def process_data(self, data):
        """get_points <shape> <number>"""
        if data.startswith('get_points'):
            request, points_shape, numbers = data.split(" ")
            if points_shape == 'circle':

            self.points_generator = Points.PointsGenerator(
                shape=points_shape,
            )

    def connection_made(self, transport):
        self.transport = transport

    def data_received(self, data):
        response = self.process_data(data.decode())
        self.transport.write(response.encode())


