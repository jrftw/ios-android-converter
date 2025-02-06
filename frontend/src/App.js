// MARK: MAIN IMPORTS
import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';

// MARK: MAIN COMPONENT
export default function App() {
  // Single-file states
  const [file, setFile] = useState(null);
  const [sourcePlatform, setSourcePlatform] = useState('ios');
  const [convertedCode, setConvertedCode] = useState('');

  // Entire-project states
  const [zipFile, setZipFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  // MARK: HANDLE SINGLE-FILE SUBMIT
  const handleSingleSubmit = async (e) => {
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

  // MARK: HANDLE ENTIRE-PROJECT SUBMIT
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!zipFile) return;
    setDownloadUrl('');
    const formData = new FormData();
    formData.append('file', zipFile);
    formData.append('sourcePlatform', sourcePlatform);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/convertProject', {
        method: 'POST',
      headers: {},
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error(errData);
        return;
      }
      // Get the blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  // MARK: RENDER
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">iOS ↔ Android Converter</h1>

      {/* SECTION 1: SINGLE-FILE CONVERSION */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Single File Conversion</h2>
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              accept=".swift,.kt,.kotlin"
              onChange={(e) => setFile(e.target.files[0])}
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                         file:bg-blue-100 file:text-blue-700 cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="singlePlatform"
                value="ios"
                checked={sourcePlatform === 'ios'}
                onChange={() => setSourcePlatform('ios')}
              />
              <span>iOS (Swift)</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="singlePlatform"
                value="android"
                checked={sourcePlatform === 'android'}
                onChange={() => setSourcePlatform('android')}
              />
              <span>Android (Kotlin)</span>
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Convert Single File
          </button>
        </form>

        {/* Show converted code */}
        {convertedCode && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Converted Code:</h3>
            <Editor
              height="300px"
              defaultLanguage={sourcePlatform === 'ios' ? 'swift' : 'kotlin'}
              value={convertedCode}
              onChange={(value) => setConvertedCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
              }}
            />
            {/* Download button for single-file */}
            <button
              onClick={() => {
                const blob = new Blob([convertedCode], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download =
                  sourcePlatform === 'ios' ? 'Converted.kt' : 'Converted.swift';
                link.click();
              }}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download Converted File
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: ENTIRE-PROJECT CONVERSION */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Entire Project Conversion</h2>
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setZipFile(e.target.files[0])}
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                         file:bg-blue-100 file:text-blue-700 cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="projectPlatform"
                value="ios"
                checked={sourcePlatform === 'ios'}
                onChange={() => setSourcePlatform('ios')}
              />
              <span>iOS Project → Android</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="projectPlatform"
                value="android"
                checked={sourcePlatform === 'android'}
                onChange={() => setSourcePlatform('android')}
              />
              <span>Android Project → iOS</span>
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Convert Entire Project
          </button>
        </form>

        {/* If we have a downloadUrl, show "Download" button */}
        {downloadUrl && (
          <div className="mt-4">
            <p className="mb-2">Converted project is ready:</p>
            <a
              href={downloadUrl}
              download="ConvertedProject.zip"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download Converted Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
