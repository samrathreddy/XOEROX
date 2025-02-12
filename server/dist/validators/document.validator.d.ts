import { z } from 'zod';
export declare const documentIngestSchema: z.ZodObject<{
    mode: z.ZodEnum<["ocr", "gpt"]>;
    fileBase64: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mode: "ocr" | "gpt";
    fileBase64: string;
}, {
    mode: "ocr" | "gpt";
    fileBase64: string;
}>;
