import express, { Application } from 'express';
import cors from 'cors';
import router from './routes/index.routes';

const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Routes
  app.use('/api', router);

  // Live check
  app.get('/', (req, res) => {
    res.send('Welcome to OCR API!');
  });

  return app;
};

export default createApp;