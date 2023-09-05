from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = load_model('NN.h5')  # Load your trained model

@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image file is provided in the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Load and preprocess the image
    img = Image.open(image)
    img = img.resize((100, 100))  # Resize the image to match your model's input size
    img = np.array(img)
    img = img / 255.0  # Normalize the pixel values if needed
    img = np.expand_dims(img, axis=0)  # Add batch dimension

    # Make predictions using your model
    predictions = model.predict(img)

    # Decode the predictions into human-readable labels
    # Modify this part based on your model's output and label encoding
    # For example, if you have a list of class names:
    class_names = ['EOSINOPHIL','LYMPHOCYTE','MONOCYTE', 'NEUTROPHIL']
    predicted_labels = [class_names[i] for i in np.argmax(predictions, axis=1)]
    print(predicted_labels)
    # Return the predicted labels as JSON response
    return jsonify({'predictions': predicted_labels})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
