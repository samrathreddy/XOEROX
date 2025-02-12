import { Configuration, OpenAIApi } from 'openai';
import env from '../config/env';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import axios from "axios";
import sharp from "sharp";

/**
 * GPT Return Type
 */
interface GPTResponse {
  markdown: string;
  inputTokens: number;
  outputTokens: number;
}

interface ChatContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

// Create OpenAI config
const configuration = new Configuration({
  apiKey: env.gptApiKey
});

const openai = new OpenAIApi(configuration);

/**
 * runGptOnText
 * @param text The text content to be turned into Markdown
 */
export const runGptOnText = async (text: string): Promise<GPTResponse> => {
  try {
    // Example system message or user prompt. Adjust as needed.
    const messages = [
      {
        role: 'system' as const,
        content: `You are a helpful assistant that converts text to structured Markdown. Avoid \`\`\`markdown tags in the response.`      },
      {
        role: 'user' as const,
        content: `Convert the following text to well-structured Markdown, preserving formatting where possible:\n\n${text}`
      },
    ];


    // Create Chat Completion
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages
    });

    // Extract text from response
    const content = response.data.choices?.[0].message?.content || '';
    // Extract token usage if available
    const usage = response.data.usage;
    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;

    return {
      markdown: content,
      inputTokens,
      outputTokens
    };
  } catch (err) {
    console.error("GPT error:", err);
    return {
      markdown: "(GPT error)",
      inputTokens: 0,
      outputTokens: 0
    };
  }
};

const compressImage = async (imageBase64: string): Promise<string> => {
    try {
      const buffer = Buffer.from(imageBase64.split(";base64,").pop()!, "base64");
      const compressedBuffer = await sharp(buffer)
        .resize(1024, 1024, { fit: "inside" }) // Resize to within 1024x1024
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();
      return `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;
    } catch (error) {
      console.error("Error compressing image:", error);
      return imageBase64; // Fallback to original if compression fails
    }
  };
  
  /**
   * Send Image to GPT-4o for Processing
   */

  export const convertKeysToSnakeCase = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => convertKeysToSnakeCase(item));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((acc: any, key) => {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        acc[snakeKey] = convertKeysToSnakeCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  };

  export const runGptOnImage = async (imageBase64: string): Promise<GPTResponse> => {
    try {
      // ✅ Compress the Image Before Sending
      const compressedImage = await compressImage(imageBase64);
  
      // ✅ OpenAI API Request Body (with camelCase to snake_case conversion)
      const requestBody = convertKeysToSnakeCase({
        model: "gpt-4o-mini", // ✅ Use gpt-4o (mini does not support images)
        messages: [
          { role: "system", content: "You are an AI that extracts text and formats structured Markdown from images. Directly extract and provide the markdown, do not include any other text or commentary. Don't assume an your own. Cover the whole image content. If there is a strike text, dont include it. If there is a signatured already alreay provide as [signature], only provide where the signatures are signed already but not left blank. Avoid ```markdown tags in the response. Make sure to include all the text from the image in the markdown and retain the styling of the text from the image provided. At top or bottom of the image there can be a pages number or chapter name or number handle even it properly. Don't break the markdown formatting. Extract insights from graphs by identifying key points and their corresponding values on the x-axis. Include these insights in the markdown text. Do not include any images of the graphs. If there are table take time and use table markdown and handle it properly." },
          { role: "user", content: [{ type: "image_url", image_url: { url: compressedImage } }] },
        ],
        maxTokens: 4024, // ✅ Converted to `max_tokens` automatically
      });
      // ✅ Send request to OpenAI API
      const response = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
        headers: {
          Authorization: `Bearer ${env.gptApiKey}`,
          "Content-Type": "application/json",
        },
      });
  
      // ✅ Extract GPT response
      const data = response.data;
  
      return {
        markdown: data.choices?.[0]?.message?.content || "(No response from GPT)",
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0,
      };
    } catch (err) {
      console.error("Error in OpenAI completion:", err);
      return {
        markdown: "(GPT error)",
        inputTokens: 0,
        outputTokens: 0,
      };
    }
  };