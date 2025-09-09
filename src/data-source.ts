import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
  migrations: [__dirname + '/migrations/*.ts', __dirname + '/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false, // Use migrations instead
  logging: true,
});
