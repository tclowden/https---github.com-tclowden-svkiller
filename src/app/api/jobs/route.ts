export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ensureDb, getSequelize } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const Job = s.model('Job') as any;
  const rows = await Job.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Job = s.model('Job') as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await Job.create({
    name: body.name ?? null,
    opportunity: body.opportunity ?? null,
    customer: body.customer ?? null,
    sales_order: body.sales_order ?? null,
    project_manager: body.project_manager ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
    transaction_type: body.transaction_type ?? null,
  });
  revalidatePath('/jobs');
  return NextResponse.json(row, { status: 201 });
}
