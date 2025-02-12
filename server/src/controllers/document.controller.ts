import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique ID generation
import { processDocumentFile } from "../services/document.service";
import axios from "axios"; // ✅ Use axios to send updates as new requests
import env from '../config/env';

// ✅ Temporary in-memory store to track status
const processingStatus: Record<string, any> = {};

/**
 * Handle document ingestion with external update requests
 */
export const ingestDocument = async (req: Request, res: Response) => {
  try {
    console.log("Received form data:", req.body);

    // Extract form-data fields
    const mode = req.body.mode.toLowerCase();
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    // Convert file buffer to base64
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const fileName = file.originalname;

    console.log("Processing file:", fileName, "Mode:", mode);

    // Generate a unique ID for tracking this request
    const uniqueId = uuidv4();

    // ✅ Store initial status in memory
    processingStatus[uniqueId] = { status: "inProgress" };

    // ✅ Send immediate response with tracking ID
    res.status(200).json({ id: uniqueId, status: "inProgress" });

    // ✅ Process the document asynchronously
    processDocumentFile({
      fileName,
      fileBase64,
      mode,
      uniqueId,
      progressCallback: async (message: string) => {
        processingStatus[uniqueId] = { status: message };

        // ✅ Send updates as new requests (replace with real client callback URL)
        await axios.post(`${env.backend}/api/v1/documents/update`, {
          id: uniqueId,
          status: message,
        }).catch(err => console.error("Error sending update:", err));
      },
    }).then((result) => {
      processingStatus[uniqueId] = { status: "completed", data: result };
      console.log("Processing completed:", env.backend);
      // ✅ Send final update to client callback URL
      axios.post(`${env.backend}/api/v1/documents/update`, {
        id: uniqueId,
        success: true,
        data: result,
      }).catch(err => console.error("Error sending final update:", err));

    }).catch((err) => {
      processingStatus[uniqueId] = { status: "failed" };
      console.error("Processing error:", err);
    });
  } catch (err) {
    console.error("Error in ingestDocument:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handle document status check
 */
export const getDocumentStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!processingStatus[id]) {
    return res.status(404).json({ error: "Document not found" });
  }
  res.json({ id, ...processingStatus[id] });
};

/**
 * Receive document update notifications (Client Callback)
 */
export const receiveUpdate = (req: Request, res: Response) => {
  console.log("Received update:", req.body);
  res.json({ success: true });
};