import * as mongoose from 'mongoose';

import { Config } from '../../app.config';

export function dbConnection() {
  console.info(`Mongo-DB at: ${Config.DB_HOST}:${Config.DB_PORT} Name: ${Config.DB_NAME}`);

  if (Config.DB_USER && Config.DB_PASSWORD)
    return `mongodb://${Config.DB_USER}:${Config.DB_PASSWORD}@${Config.DB_HOST}:${Config.DB_PORT}/${Config.DB_NAME}`;
  else
    return `mongodb://${Config.DB_HOST}:${Config.DB_PORT}/${Config.DB_NAME}`;
}

export const databaseProvider = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(dbConnection(), { useNewUrlParser: true }),
  },
];


