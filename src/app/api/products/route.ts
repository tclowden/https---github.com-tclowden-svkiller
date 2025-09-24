export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ensureDb, getSequelize } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const Product = s.model('Product') as any;
  const rows = await Product.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Product = s.model('Product') as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await Product.create({
    name: body.name ?? null,
    unit_of_measure: body.unit_of_measure ?? null,
    cost_per_uom: body.cost_per_uom ?? null, // string in your schema
  });
  revalidatePath('/products');
  return NextResponse.json(row, { status: 201 });
}
