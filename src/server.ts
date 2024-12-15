import app from './app.js';
import { Config } from './config/index.js';

const PORT = Config.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} value`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
