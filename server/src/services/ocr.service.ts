import Tesseract from 'tesseract.js';
import env from '../config/env';

/**
 * runOcrOnImage
 * @param imageBase64 base64-encoded image
 * @returns extracted text
 */
export const runOcrOnImage = async (imageBase64: string): Promise<string> => {
  try {
    const result = await Tesseract.recognize(imageBase64, env.ocrLanguage);
    return result.data.text;
  } catch (err) {
    console.error("OCR error:", err);
    return "(OCR error)";
  }
};