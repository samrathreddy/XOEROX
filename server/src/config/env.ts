import * as dotenv from 'dotenv';
dotenv.config();


export default {
  port: process.env.PORT || 3000,
  gptApiKey: process.env.GPT_API_KEY || 'tess',
  ocrLanguage: process.env.OCR_LANGUAGE || 'eng',
  backend: process.env.BACKEND_URL || 'http://localhost:5000'
};