import React from 'react';
import { RefreshCw, Play } from 'lucide-react';
import { ToolbarProps } from '../types';

export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  setMode,
  onProcess,
  onReset,
  isProcessing,
}) => {
  return (
    <div className="flex justify-center items-center">
      <div className="inline-flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-lg border border-gray-800">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'OCR' | 'GPT')}
          className="px-3 py-2 bg-[#0F0F0F] border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="OCR">OCR + OpenAI</option>
          <option value="GPT">OpenAI</option>
        </select>
        <button
          onClick={onProcess}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Play size={16} />
          Process
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-md hover:bg-[#0F0F0F] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
};