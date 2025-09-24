// scripts/db-smoke.ts
import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { Sequelize } from 'sequelize-typescript';
// 👇 Explicitly import the barrel file (ESM needs the extension)
import * as models from '../src/models/index.js';

async function main() {
  const modelClasses = Object.values(models).filter(
    // keep only class-ish exports
    (v) => typeof v === 'function'
  ) as any[];

  const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: console.log,
    models: modelClasses,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ DB connection OK');
    const { User } = models as any;
    console.log('Users:', await User.count());
  } finally {
    await sequelize.close();
  }
}
main();
