import app from './app';
import { startApp } from './config/DB';
import logger from './config/logger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on port: ${PORT}`);
      // connectToDatabase();
      startApp();
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  }
};

startServer();
