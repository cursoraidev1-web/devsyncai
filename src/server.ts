import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { supabase } from './config/supabase';

// Test database connection
const testDatabaseConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
    logger.info('✅ Database connection successful');
  } catch (error) {
    logger.error('❌ Failed to connect to database');
    throw error;
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    await testDatabaseConnection();

    // Start listening
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server is running on port ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 Health check: http://localhost:${env.PORT}/health`);
      logger.info(`📡 API Base: http://localhost:${env.PORT}/api/v1`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        logger.info('✅ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
