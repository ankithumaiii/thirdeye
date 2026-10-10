import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import configRoutes from './routes/config.routes.js';
import scenariosRoutes from './routes/scenarios.routes.js';
import simulationRoutes from './routes/simulation.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security CORS config
const allowedOrigins = [
  ENV.FRONTEND_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
  },
  credentials: true
}));

// Request body parser with safe limit
app.use(express.json({ limit: '100kb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/config', configRoutes);
app.use('/api/scenarios', scenariosRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/ai', aiRoutes);

// Catch-all 404
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
