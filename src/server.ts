import app from './app';
import { Config } from './config/index';
import logger from './config/logger';

const PORT = Config.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on port 2: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
