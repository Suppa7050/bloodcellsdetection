import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError('');
    setPrediction('');
  };

  const handlePredict = () => {
    if (!selectedFile) {
      setError('Please select an image.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', selectedFile);
  
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response Data:', data); // Log the response data
        if (data.error) {
          setError(data.error);
          setPrediction('');
        } else {
          setPrediction(data.predictions[0]);
          setError('');
        }
      })
      .catch((error) => {
        console.error('Fetch Error:', error); // Log any fetch errors
        setError('An error occurred while making the prediction.');
        setPrediction('');
      });
  };
  

  return (
    <div className="App">
      <h1>Blood Cell Type Prediction</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handlePredict}>Predict</button>

      {error && <div className="error">{error}</div>}

      {prediction && (
        <div className="prediction">
          <h2>Prediction</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;
