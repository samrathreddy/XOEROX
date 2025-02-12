/**
 * GPT Return Type
 */
interface GPTResponse {
    markdown: string;
    inputTokens: number;
    outputTokens: number;
}
/**
 * runGptOnText
 * @param text The text content to be turned into Markdown
 */
export declare const runGptOnText: (text: string) => Promise<GPTResponse>;
/**
 * Send Image to GPT-4o for Processing
 */
export declare const convertKeysToSnakeCase: (obj: any) => any;
export declare const runGptOnImage: (imageBase64: string) => Promise<GPTResponse>;
export {};
