import torch
import torch.nn as nn
from .base_model import BaseAIModel

channel_size = 255  # pixels in the width/height of the images


class DogCatClassifier(BaseAIModel, nn.Module):
    def __init__(self):
        super(DogCatClassifier, self).__init__()

        # define layers
        self.layers = nn.ModuleList(
            [
                nn.Conv2d(
                    3, 6, 3
                ),  # no padding, so we lose 1 row and column on each side. The size of each channel becomes channel_size - 2
                nn.BatchNorm2d(6),
                nn.MaxPool2d(2),
                nn.Conv2d(6, 12, 3),
                nn.BatchNorm2d(12),
                nn.MaxPool2d(2),
                nn.Conv2d(12, 24, 3),
                nn.BatchNorm2d(24),
                nn.MaxPool2d(2),
                nn.Flatten(),
                nn.Linear(
                    24 * int((channel_size - 14) // 8) * int((channel_size - 14) // 8),
                    512,
                ),
                nn.ReLU(),
                # Regularization
                nn.Dropout(p=0.5),
            ]
        )
        self.relu = nn.ReLU()
        # convert to two-classifications for dog/cat
        self.output_layer = nn.Linear(in_features=512, out_features=2)

    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
            x = self.output_layer(x)
        return x

    def _preprocess_image(self, image) -> torch.Tensor:
        """Normalize and crop image to expected model input format.

        Args:
            image: PIL Image or numpy array

        Returns:
            torch.Tensor of shape (1, 3, channel_size, channel_size)
        """
        # Convert to tensor if needed
        if not isinstance(image, torch.Tensor):
            image = torch.from_numpy(image).float()

        # Add batch dimension if needed
        if len(image.shape) == 3:
            image = image.unsqueeze(0)

        # Ensure correct channel order (B, C, H, W)
        if image.shape[1] != 3:
            image = image.permute(0, 3, 1, 2)

        # Resize if needed
        if image.shape[-1] != channel_size or image.shape[-2] != channel_size:
            image = torch.nn.functional.interpolate(
                image,
                size=(channel_size, channel_size),
                mode="bilinear",
                align_corners=False,
            )

        return image

    @torch.no_grad()
    def predict(self, input_data: dict) -> dict:
        self.eval()
        # Process input
        image = input_data.get("image")
        image = self._preprocess_image(image)
        # Make prediction
        output = self.forward(image)
        # Process output
        return {"prediction": output.tolist()}

    def load_weights(self, path: str) -> None:
        self.load_state_dict(torch.load(path))

    @property
    def model_id(self) -> str:
        return "dog-cat-classifier"
