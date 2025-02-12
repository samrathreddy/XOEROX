/**
 * detectFileType
 * Basic file extension check
 */
export declare const detectFileType: (fileName: string) => 'pdf' | 'image';
export declare const convertPdfToImages: (pdfBase64: string) => Promise<string[]>;
