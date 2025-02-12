import { Router } from 'express';
import documentRoutes from './document.routes';

const router = Router();

// All document routes
router.use('/v1/documents', documentRoutes);


export default router;