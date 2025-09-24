import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { ensureDb, getSequelize } from '@/lib/db';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const User = s.model('User') as any;

  const rows = await User.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const User = s.model('User') as any;

  const body = await req.json();
  const hash = await bcrypt.hash(body.password, 10);

  const user = await User.create({
    email: body.email,
    name: body.name,
    password_hash: hash,
  });

  return NextResponse.json(user);
}
