from abc import abstractmethod, ABC


class NetworkInterface(ABC):
    @abstractmethod
    def train(self, batch) -> str:
        pass

    @abstractmethod
    def __str__(self) -> str: pass

    @abstractmethod
    def to_json(self):
        pass
