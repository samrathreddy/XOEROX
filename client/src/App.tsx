import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { PDFViewer } from './components/PDFViewer';
import { OutputViewer } from './components/OutputViewer';
import { Toolbar } from './components/Toolbar';
import { ProcessingMode, DocumentData } from './types';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<ProcessingMode>('OCR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeView, setActiveView] = useState<'markdown' | 'json'>('markdown');
  const [data, setData] = useState<DocumentData>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setFile(file);
    setData({});
  }, []);

  const handleProcess = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage("Starting processing...");
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/documents/ingest`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      const { id } = await response.json();

      // Polling for status updates
      const intervalId = setInterval(async () => {
        const statusResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/documents/status/${id}`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'completed') {
          clearInterval(intervalId);
          setData(statusData.data);
          setStatusMessage(null);
          setIsProcessing(false);
        } else if (statusData.status === 'failed') {
          clearInterval(intervalId);
          setStatusMessage("Processing failed.");
          setIsProcessing(false);
        } else {
          setStatusMessage(statusData.status);
        }
      }, 2000); // Poll every 2 seconds

    } catch (error) {
      console.error('Error processing document:', error);
      setStatusMessage("Error processing document.");
      setIsProcessing(false);
    }
  }, [file, mode]);

  const handleReset = useCallback(() => {
    setFile(null);
    setData({});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">XOEROX</h1>
        
        <Toolbar
          mode={mode}
          setMode={setMode}
          onProcess={handleProcess}
          onReset={handleReset}
          isProcessing={isProcessing}
        />

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-gray-800">
            {!file ? (
              <FileUpload onFileSelect={handleFileSelect} />
            ) : (
              <PDFViewer file={file} />
            )}
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-gray-800">
            <OutputViewer
              data={data}
              activeView={activeView}
              setActiveView={setActiveView}
              isProcessing={isProcessing}
              statusMessage={statusMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;