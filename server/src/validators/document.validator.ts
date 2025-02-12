import { z } from 'zod';

export const documentIngestSchema = z.object({
  mode: z.enum(["ocr", "gpt"]),
  fileBase64: z.string().nonempty("fileBase64 is required")
});