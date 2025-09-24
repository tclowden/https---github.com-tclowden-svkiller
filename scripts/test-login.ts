import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { Sequelize } from 'sequelize-typescript';
import * as models from '../src/models/index.ts';
import bcrypt from 'bcrypt';

const modelClasses = Object.values(models).filter((v): v is new (...a:any[])=>any => typeof v === 'function');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL missing');
    process.exit(1);
  }

  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    models: modelClasses,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    const { User } = models as any;
    const user = await User.findOne({ where: { email: 'admin@example.com' } });

    if (!user) {
      console.log('⚠️ No user found with email admin@example.com');
      return;
    }

    const hash = user.password_hash;
    console.log('email:', user.email, '| hash len:', hash ? hash.length : 'null');

    if (!hash) {
      console.log('❌ password_hash is NULL. You need to set a hash.');
      return;
    }

    const ok = await bcrypt.compare('admin123', hash);
    console.log('bcrypt ok?', ok);
  } catch (e) {
    console.error(e);
  } finally {
    await sequelize.close();
  }
}

main();
