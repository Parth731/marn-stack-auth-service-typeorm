import app from './app.js';
import { Config } from './config/index.js';
import logger from './config/logger.js';

const PORT = Config.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
