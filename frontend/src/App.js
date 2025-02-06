// App.js
// MARK: MAIN IMPORTS
import React, { useState } from 'react';

// MARK: MAIN COMPONENT
export default function App() {
  const [file, setFile] = useState(null);
  const [sourcePlatform, setSourcePlatform] = useState('ios');
  const [convertedCode, setConvertedCode] = useState('');

  // MARK: HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourcePlatform', sourcePlatform);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/convert', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setConvertedCode(data.convertedCode || JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  // MARK: RENDER
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          iOS ↔ Android Converter
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="file"
              accept=".swift,.kt,.kotlin"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200
                         cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="platform"
                value="ios"
                checked={sourcePlatform === 'ios'}
                onChange={() => setSourcePlatform('ios')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">iOS (Swift)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="platform"
                value="android"
                checked={sourcePlatform === 'android'}
                onChange={() => setSourcePlatform('android')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Android (Kotlin)</span>
            </label>
          </div>
          <button
            type="submit"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 focus:ring-2 
                       focus:ring-blue-500 focus:ring-opacity-50 text-white font-semibold 
                       py-2 px-4 rounded-lg"
          >
            Convert
          </button>
        </form>
        {convertedCode && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Converted Code
            </h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap break-all">
              {convertedCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
