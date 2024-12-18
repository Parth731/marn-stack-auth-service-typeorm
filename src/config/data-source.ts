import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres', // PostgreSQL setup
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  //   database: 'marnstack_auth_service_test',
  //   entities: [`${__dirname}/**/entities/*.{ts,js}`],
  //   migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
  entities: [User],
  synchronize: false, //don't use this in production, always keep false
  logging: false,
  migrations: [],
  subscribers: [],
});

// export const MongoDataSource = new DataSource({
//   type: 'mongodb',
//   url: Config.DB_MONGODB_URL,
//   useUnifiedTopology: true,
//   database: Config.DB_MONGODB_DB,
//   entities: [User],
//   synchronize:
//     Config.NODE_ENV === 'test' || Config.NODE_ENV === 'dev' ? true : false, // Use only in development env
//   logging: false,
// });
