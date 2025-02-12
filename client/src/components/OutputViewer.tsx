import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import { OutputViewerProps } from "../types";
import remarkGfm from "remark-gfm";

export const OutputViewer: React.FC<OutputViewerProps> = ({
  data,
  activeView,
  setActiveView,
  isProcessing,
  statusMessage,
}) => {
  const markdownContent = data.pages
    ? data.pages.map((page: any) => page.markdown).join("\n\n---\n\n")
    : "";

  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, [data]);

  const handleCopy = () => {
    const contentToCopy =
      activeView === "json"
        ? JSON.stringify(data, null, 2)
        : markdownContent;
    navigator.clipboard.writeText(contentToCopy || "");
  };

  return (
    <div className="h-full flex flex-col relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="text-xl font-medium px-8 py-4 bg-gradient-to-r from-white via-gray-400 to-white text-transparent bg-clip-text animate-slide-gradient">
              {statusMessage}
            </div>
          </div>
        </div>
      )}
      <div className={`flex gap-2 mb-4 ${isProcessing ? "blur-sm" : ""}`}>
        <button
          className={`px-4 py-2 rounded ${
            activeView === "markdown"
              ? "bg-blue-600 text-white"
              : "bg-[#0F0F0F] text-gray-300 hover:bg-[#2A2A2A]"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={() => setActiveView("markdown")}
          disabled={isProcessing}
        >
          Markdown
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeView === "json"
              ? "bg-blue-600 text-white"
              : "bg-[#0F0F0F] text-gray-300 hover:bg-[#2A2A2A]"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={() => setActiveView("json")}
          disabled={isProcessing}
        >
          JSON
        </button>
      </div>
      <div
        className={`flex-1 overflow-auto bg-[#0F0F0F] rounded-lg border border-gray-800 ${
          isProcessing ? "blur-sm" : ""
        }`}
      >
        {activeView === "json" ? (
          <div className="relative h-full">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={data ? JSON.stringify(data, null, 2) : ""}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
            {data && (
              <button
                className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded"
                onClick={handleCopy}
              >
                Copy
              </button>
            )}
          </div>
        ) : (
          <div className="relative h-full p-6 overflow-y-auto max-h-screen">
            <div className="prose prose-invert prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-300 prose-a:text-blue-400 prose-code:text-gray-300 prose-pre:bg-gray-800 max-w-none">
              <ReactMarkdown
                key={refreshKey}
                remarkPlugins={[remarkGfm]}
              >
                {markdownContent || ""}
              </ReactMarkdown>
            </div>
            {markdownContent && (
              <button
                className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded"
                onClick={handleCopy}
              >
                Copy
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};