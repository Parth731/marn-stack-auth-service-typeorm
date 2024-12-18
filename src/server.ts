import app from './app';
import { startApp } from './config/DB';
import { Config } from './config/index';
import logger from './config/logger';

const PORT = Config.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on port: ${PORT}`);
      // connectToDatabase();
      startApp();
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
