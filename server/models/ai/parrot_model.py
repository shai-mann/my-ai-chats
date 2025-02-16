import torch.nn as nn
from .base_model import BaseAIModel
import time


# This model is a parrot that repeats what the user says
class ParrotModel(BaseAIModel, nn.Module):
    def __init__(self):
        super(ParrotModel, self).__init__()

    def predict(self, input_data: dict) -> dict:
        time.sleep(1)  # make it seem like it's crunching the numbers
        print("Predicting...")
        # This fake model just returns the user's message
        return {"prediction": input_data.get("content")}

    def load_weights(self, path: str) -> None:
        pass

    @property
    def model_id(self) -> str:
        return "parrot-model"
