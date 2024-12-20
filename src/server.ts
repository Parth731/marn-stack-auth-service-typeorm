import app from './app';
import { startApp } from './config/DB';
import logger from './config/logger';
import swaggerDocs from './utils/swagger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await startApp();
    logger.info('Database connected successfully!');
    swaggerDocs(app, Number(PORT));
    app.listen(PORT, async () => {
      logger.info(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

startServer();
