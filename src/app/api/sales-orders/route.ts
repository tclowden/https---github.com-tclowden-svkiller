export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ensureDb, getSequelize } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const SalesOrder = s.model('SalesOrder') as any;
  const rows = await SalesOrder.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const SalesOrder = s.model('SalesOrder') as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await SalesOrder.create({
    name: body.name ?? null,
    opportunity: body.opportunity ?? null,
    customer: body.customer ?? null,
    project_manager: body.project_manager ?? null,
    sales_rep: body.sales_rep ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
    transaction_type: body.transaction_type ?? null,
  });
  revalidatePath('/sales-orders');
  return NextResponse.json(row, { status: 201 });
}
