export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ensureDb, getSequelize } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const Task = s.model('Task') as any;
  const rows = await Task.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Task = s.model('Task') as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await Task.create({
    name: body.name ?? null,
    owner: body.owner ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
    transaction_type: body.transaction_type ?? null,
  });
  revalidatePath('/tasks');
  return NextResponse.json(row, { status: 201 });
}
