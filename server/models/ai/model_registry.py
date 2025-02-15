from typing import Dict, Type
from .base_model import BaseAIModel
from .dog_cat_classifier import DogCatClassifier
from .parrot_model import ParrotModel


class ModelRegistry:
    def __init__(self):
        self._models: Dict[str, BaseAIModel] = {}
        self._model_classes: Dict[str, Type[BaseAIModel]] = {
            "dog-cat-classifier": DogCatClassifier,
            "parrot-model": ParrotModel,
        }

    def get_model(self, model_id: str) -> BaseAIModel:
        if model_id not in self._models:
            if model_id not in self._model_classes:
                raise ValueError(f"Unknown model ID: {model_id}")

            model_class = self._model_classes[model_id]
            model = model_class()
            # Load weights from configured path
            weights_path = f"weights/{model_id}.pth"
            model.load_weights(weights_path)
            self._models[model_id] = model

        return self._models[model_id]


# Global model registry instance
model_registry = ModelRegistry()
