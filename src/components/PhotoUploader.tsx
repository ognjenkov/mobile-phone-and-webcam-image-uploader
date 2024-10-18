import React, { useState, useRef, useEffect } from 'react';

const PhotoUploader: React.FC = () => {
    // const [message, setMessage] = useState<string>('')
    // const [message1, setMessage1] = useState<string>('')
    // const [message2, setMessage2] = useState<string>('')
    // const [message3, setMessage3] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const requestCameraPermission = async () => {
    try {
    //   setMessage2('Entered try block');
  
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Result:', result);
  
    //   setMessage('Permission state: ' + result.state);
      console.log('Set message to:', 'Permission state: ' + result.state);
  
      if (result.state === 'granted') {
        return true; // Permission already granted
      } else if (result.state === 'prompt') {
        // Await user interaction here
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          return !!stream; // If we reach here, permission was granted
        } catch (error) {
          // Handle user denying permission
          setError('Camera permission denied. Please enable it in your browser settings.');
          return false;
        }
      } else {
        setError('Camera permission denied. Please enable it in your browser settings.');
        return false; // Permission denied
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return true; // Proceed anyway if Permissions API is not supported
    }
  };

  const handleCameraCapture = async () => {
    setError(null);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    // setMessage1('hasPremission : ' + String(hasPermission))

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Failed to access the camera. Please make sure you have given permission and your camera is not in use by another application.');
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
          setSelectedFile(file);
        }
      }, 'image/jpeg');
      
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleDownload = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Phone Photo Uploader</h1>
        
        <div className="mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            [^] Upload Photo
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Webcam Uploader</h1>
        <div className="mb-4">
          <button
            onClick={isCameraActive ? stopCamera : handleCameraCapture}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          >
            {isCameraActive ? '[x] Close Camera' : '[o] Open Camera'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        
          <div className="mb-4">
            <video 
              ref={videoRef} 
              className="w-full h-48 object-cover mb-2 bg-black"
              playsInline
            />
            <button
              onClick={handleCapture}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-200"
            >
              Capture Photo
            </button>
          </div>
        
        
        {selectedFile && (
          <div className="mt-4">
            <p className="mb-2">Selected file: {selectedFile.name}</p>
            <div className="flex justify-between">
              <button
                onClick={handleDownload}
                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-200"
              >
                Download
              </button>
              <button
                onClick={() => console.log('Send to API')}
                className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-200"
              >
                Send to API
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <span>mesage: <br/>{message} <br/></span>
      <span>mesage1: <br/>{message1} <br/></span>
      <span>mesage2: <br/>{message2} <br/></span>
      <span>mesage3: <br/>{message3} <br/></span>
      <input type="file" accept="image/*, video/*"></input> */}
    </div>
  );
};

export default PhotoUploader;