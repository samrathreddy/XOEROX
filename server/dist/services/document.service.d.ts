interface ProcessDocumentOptions {
    fileName: string;
    fileBase64: string;
    mode: "ocr" | "gpt";
    uniqueId: string;
    progressCallback?: (message: string) => void;
}
export declare const processDocumentFile: (options: ProcessDocumentOptions) => Promise<{
    fileName: string;
    mode: "ocr" | "gpt";
    pages: {
        pageNumber: number;
        inputText: string;
        markdown: string;
        inputTokens: number;
        outputTokens: number;
    }[];
}>;
export {};
