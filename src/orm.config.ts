import { DataSourceOptions } from 'typeorm';

export default {
  type: 'postgres',
  host: 'db',
  database: process.env.POSTGRES_DB,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['dist/**/entities/*.entity.js'],
  synchronize: true,
} as DataSourceOptions;
