"use client"
// components/WebcamComponent.js

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages(prevImages => [...prevImages, imageSrc]);
  }, [webcamRef]);

  const deleteImage = useCallback(index => {
    setCapturedImages(prevImages => prevImages.filter((_, i) => i !== index));
  }, []);

  const saveToComputer = useCallback(index => {
    const imageSrc = capturedImages[index];
    // For simplicity, you can create a download link to save the image
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `captured_image_${index}.jpg`;
    link.click();
  }, [capturedImages]);

  useEffect(() => {
    // Run this code only on the client side
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && capturedImages.length > 0) {
        // Delete the last captured image when the "Delete" key is pressed
        deleteImage(capturedImages.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [capturedImages, deleteImage]);

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="mb-4 border" />
      <button onClick={capture} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">
        Capture Photo
      </button>

      {/* Display captured images */}
      <div className="flex flex-wrap -mx-2">
        {capturedImages.map((image, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
            <div className="relative">
              <img src={image} alt={`Captured ${index}`} className="w-full h-auto rounded-md mb-2" />
              <div className="absolute bottom-0 right-0 flex space-x-2">
                <button onClick={() => deleteImage(index)} className="bg-red-500 text-white px-2 py-1 rounded-md">
                  Delete
                </button>
                <button onClick={() => saveToComputer(index)} className="bg-green-500 text-white px-2 py-1 rounded-md">
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebcamComponent;
