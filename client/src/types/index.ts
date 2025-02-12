export type ProcessingMode = 'OCR' | 'GPT';

export interface DocumentData {
  success: boolean;
  data: {
    fileName: string;
    mode: string;
    pages: {
      pageNumber: number;
      inputText: string;
      markdown: string;
      inputTokens: number;
      outputTokens: number;
    }[];
  };
  pages?: Array<{ markdown: string }>;
  markdown?: string;
}

export interface ViewerProps {
  file: File | null;
  data: DocumentData;
}

export interface ToolbarProps {
  mode: ProcessingMode;
  setMode: (mode: ProcessingMode) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export interface OutputViewerProps {
  data: DocumentData;
  activeView: 'markdown' | 'json';
  setActiveView: (view: 'markdown' | 'json') => void;
  isProcessing: boolean;
  statusMessage: string | null;
}