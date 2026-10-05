import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import bookingRoutes from './routes/bookingRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import googleHotelsRoutes from './routes/googleHotelsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/google-hotels', googleHotelsRoutes);

import type { Request, Response } from 'express';

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Vana Resort Araku API', time: new Date() });
});

// Database & Server initialization
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Vana Resort API] Running on http://localhost:${PORT}`);
  });
});

export default app;
