import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * detectFileType
 * Basic file extension check
 */
export const detectFileType = (fileName: string): 'pdf' | 'image' => {
  const ext = path.extname(fileName).toLowerCase();
  if (ext.includes('pdf')) {
    return 'pdf';
  }
  return 'image';
};


export const convertPdfToImages = async (pdfBase64: string): Promise<string[]> => {
  try {
    // Step 1: Decode base64 to a buffer
    const pdfBuffer = Buffer.from(pdfBase64.split(';base64,').pop()!, 'base64');

    // Step 2: Write buffer to a temporary PDF file
    const tempPdfPath = path.join(__dirname, `temp-${Date.now()}.pdf`);
    await fs.writeFile(tempPdfPath, pdfBuffer);

    // Step 3: Create an output directory for images
    const outputDir = path.join(__dirname, `pdf-images-${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });

    // Step 4: Convert PDF pages to images using `pdf-poppler`
    const pdfToImagesCommand = `pdftoppm -png "${tempPdfPath}" "${outputDir}/page"`;
    await execPromise(pdfToImagesCommand);

    // Step 5: Read generated images and convert them to base64
    const imageFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.png'));

    if (imageFiles.length === 0) {
      throw new Error("No images generated from PDF.");
    }

    const base64Images: string[] = await Promise.all(
      imageFiles.map(async (file) => {
        const imagePath = path.join(outputDir, file);
        const imageBuffer = await fs.readFile(imagePath);
        return `data:image/png;base64,${imageBuffer.toString('base64')}`;
      })
    );

    // Step 6: Cleanup temporary files
    await fs.unlink(tempPdfPath);
    await fs.rm(outputDir, { recursive: true, force: true });

    return base64Images;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    return [];
  }
};