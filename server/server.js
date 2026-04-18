import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitizeMiddleware from './middleware/sanitize.js';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import credentialRoutes from './routes/credentialRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import cardRoutes from "./routes/cardRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ── Middleware ──
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://tala-password-manager.vercel.app'
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitizeMiddleware);

app.use("/api/cards", cardRoutes);
app.use('/api', apiLimiter);

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/credentials', credentialRoutes);

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ message: '🔐 Tala API is running' });
});

// ── Error handler ──
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});