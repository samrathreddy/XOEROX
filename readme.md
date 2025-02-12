# XOEROX AI - Document Processor

XOEROX AI is a document processing application that helps in conversion of unstructured data to structure data using Optical Character Recognition (OCR) as well as Open AI for enhanced text extraction and formatting. It allows users to upload PDF files, process them to extract text, and convert the text into structured Markdown as well as in JSON.

#### Project Proof of Concept : [Click here](https://www.loom.com/share/52583e6b1b684f6b8570b6751e286809)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **OCR**: Tesseract.js
- **AI Integration**: OpenAI GPT
- **Image Processing**: Sharp
- **PDF to Image Conversion**: pdf-poppler

## Features

- Upload PDF files for processing.
- Extract text using OCR and format it using Open AI or else Directly using Open AI for best result.
- View extracted content in Markdown or JSON format.
- Real-time status updates during processing.

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- OpenAI API Key

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/samrathreddy/xoerox.git
   cd xoerox
   ```

2. **Install Dependencies**

   Navigate to both the `client` and `server` directories and install the dependencies:

   ```bash
   # In the client directory
   cd client
   npm install
   # or
   yarn install

   # In the server directory
   cd ../server
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**

   Create a `.env` file in the `server` directory and add your OpenAI API key and other configurations:

   ```env
   GPT_API_KEY=your_openai_api_key
   PORT=3000
   OCR_LANGUAGE=eng
   BACKEND_URL=http://localhost:3000
   ```

   Create a `.env` file in the `client` directory and add your backend url:

   ```env
   BACKEND_URL=http://localhost:3000
   ```

4. **Run the Application**

   Start both the client and server:

   ```bash
   # In the client directory
   npm run dev
   # or
   yarn dev

   # In the server directory for directly building and running
   npm run build-run
   # or
   yarn build-run
   ```

5. **Access the Application**

   Open your browser and navigate to `http://localhost:5173` to access the XOEROX application. (Check frontend url in client terminal, it might differ)

## Code Structure

- **Client**: Contains the React frontend code.

  - Components like `Toolbar`, `FileUpload`, and `OutputViewer` manage the UI and user interactions.
  - TypeScript is used for type safety and better code management.

- **Server**: Contains the Node.js backend code.
  - Services like `document.service.ts` and `gpt.service.ts` handle document processing and AI integration.
  - Utilizes Tesseract.js for OCR and OpenAI's GPT for text processing.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.
