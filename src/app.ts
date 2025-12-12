import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

// Create Express application
const app: Application = express();

// ==================== SECURITY MIDDLEWARE ====================
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  })
);

// ==================== BODY PARSING MIDDLEWARE ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ==================== COMPRESSION ====================
app.use(compression());

// ==================== LOGGING ====================
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    })
  );
}

// ==================== RATE LIMITING ====================
app.use('/api/', generalLimiter);

// ==================== HEALTH CHECK ====================
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Zyndrx API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ==================== API ROUTES ====================
// TODO: Import and use route modules here
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/projects', projectRoutes);
// ... etc

// Temporary placeholder route
app.get('/api/v1', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Zyndrx API v1',
    version: '1.0.0',
    documentation: '/api/v1/docs',
  });
});

// ==================== ERROR HANDLING ====================
app.use(notFoundHandler); // 404 handler
app.use(errorHandler); // Global error handler

export default app;
