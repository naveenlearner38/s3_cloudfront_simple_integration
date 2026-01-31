import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { connectDB } from './src/config/database';
import { errorHandler } from './src/middleware/error.middleware';
import authRoutes from './src/routes/auth.routes';
import imageRoutes from './src/routes/image.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();


// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'S3 Image Upload API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});