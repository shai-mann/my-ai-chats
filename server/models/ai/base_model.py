from abc import ABC, abstractmethod


class BaseAIModel(ABC):
    @abstractmethod
    def predict(self, input_data: dict) -> dict:
        """Make a prediction with the model"""
        pass

    @abstractmethod
    def load_weights(self, path: str) -> None:
        """Load model weights from a file"""
        pass

    @property
    @abstractmethod
    def model_id(self) -> str:
        """Unique identifier for this model"""
        pass
