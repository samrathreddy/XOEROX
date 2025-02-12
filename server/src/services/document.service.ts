import { detectFileType, convertPdfToImages } from "../utils/fileUtils";
import { runOcrOnImage } from "./ocr.service";
import { runGptOnImage, runGptOnText } from "./gpt.service";
import fs from "fs";
import path from "path";

interface ProcessDocumentOptions {
  fileName: string;
  fileBase64: string;
  mode: "ocr" | "gpt";
  uniqueId: string;
  progressCallback?: (message: string) => void;
}

export const processDocumentFile = async (options: ProcessDocumentOptions) => {
  const { fileName, fileBase64, mode, uniqueId, progressCallback } = options;
  const fileType = detectFileType(fileName);

  let imagesBase64: string[] = [];

  if (fileType === "pdf") {
    progressCallback?.("Converting PDF to images...");
    imagesBase64 = await convertPdfToImages(fileBase64);
    progressCallback?.(`Converted PDF to ${imagesBase64.length} images.`);
  } else {
    imagesBase64 = [fileBase64];
  }

  // Save activity log
  const activityDir = path.join(__dirname, "../activity-history");
  if (!fs.existsSync(activityDir)) {
    fs.mkdirSync(activityDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const activityFile = path.join(activityDir, `document-${timestamp}.json`);
  fs.writeFileSync(activityFile, JSON.stringify({ fileName, images: imagesBase64, timestamp }, null, 2));

  const pages = [];

  for (let i = 0; i < imagesBase64.length; i++) {
    const pageNumber = i + 1;
    let pageInputText = "";
    let pageMarkdown = "";
    let inputTokens = 0;
    let outputTokens = 0;

    progressCallback?.(`Processing page ${pageNumber}...`);

    if (mode === "ocr") {
      progressCallback?.(`Running OCR on page ${pageNumber}...`);
      const extractedText = await runOcrOnImage(imagesBase64[i]);
      pageInputText = extractedText;

      progressCallback?.(`Processing extracted text with GPT for page ${pageNumber}...`);
      const gptResult = await runGptOnText(extractedText);
      pageMarkdown = gptResult.markdown;
      inputTokens = gptResult.inputTokens;
      outputTokens = gptResult.outputTokens;
    } else {
      progressCallback?.(`Processing page ${pageNumber} with GPT...`);
      const gptResult = await runGptOnImage(imagesBase64[i]);
      pageMarkdown = gptResult.markdown;
      inputTokens = gptResult.inputTokens;
      outputTokens = gptResult.outputTokens;
    }

    pages.push({ pageNumber, inputText: pageInputText, markdown: pageMarkdown, inputTokens, outputTokens });

    progressCallback?.(`Completed processing page ${pageNumber}.`);
  }

  progressCallback?.("Processing complete.");

  return {
    fileName,
    mode,
    pages,
  };
};