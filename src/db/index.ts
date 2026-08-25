// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isPgConfigured = (): boolean => {
  return Boolean(
    process.env.SQL_HOST &&
    process.env.SQL_DB_NAME &&
    process.env.SQL_USER &&
    process.env.SQL_PASSWORD
  );
};

export const createPool = (): Pool => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      port: Number(process.env.SQL_PORT) || 5432,
      database: process.env.SQL_DB_NAME,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return global._postgresPool;
};

export const getDb = () => {
  if (!isPgConfigured()) {
    return null;
  }
  const pool = createPool();
  return drizzle(pool, { schema });
};
