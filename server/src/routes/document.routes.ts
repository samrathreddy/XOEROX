import { Router } from 'express';
import upload from '../middleware/upload';
import { ingestDocument, getDocumentStatus, receiveUpdate } from '../controllers/document.controller';

const router = Router();

// Upload route - using multipart/form-data
router.post('/ingest', upload.single('file'), ingestDocument);
router.get('/status/:id', getDocumentStatus);
router.post('/update', receiveUpdate);

export default router;