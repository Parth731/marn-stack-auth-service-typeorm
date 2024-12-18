import { AppDataSource } from './data-source';

export const startApp = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL connected successfully!');

    // await MongoDataSource.initialize();
    // console.log('MongoDB connected successfully!');

    // You can now use repositories or managers for CRUD operations
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
  }
};