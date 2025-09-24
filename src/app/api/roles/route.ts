export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ensureDb, getSequelize } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const Role = s.model('Role') as any;
  const rows = await Role.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Role = s.model('Role') as any;

  const body = await req.json().catch(() => ({} as any));
  const { name } = body || {};
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const row = await Role.create({ name });
  revalidatePath('/admin/roles');
  return NextResponse.json(row, { status: 201 });
}
