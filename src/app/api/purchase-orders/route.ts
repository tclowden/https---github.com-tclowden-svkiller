export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ensureDb, getSequelize } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const PurchaseOrder = s.model('PurchaseOrder') as any;
  const rows = await PurchaseOrder.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const PurchaseOrder = s.model('PurchaseOrder') as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await PurchaseOrder.create({
    name: body.name ?? null,
    transaction_type: body.transaction_type ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
  });
  revalidatePath('/purchase-orders');
  return NextResponse.json(row, { status: 201 });
}
