export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ensureDb, getSequelize } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const Vendor = s.model('Vendor') as any;
  const rows = await Vendor.findAll({ order: [['createdAt', 'DESC']], raw: true });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Vendor = s.model('Vendor') as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await Vendor.create({
    name: body.name ?? null,
    street_address: body.street_address ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    zip: body.zip ?? null,
    payment_terms: body.payment_terms ?? null,
    primary_contact: body.primary_contact ?? null,
    primary_phone_number: body.primary_phone_number ?? null,
    primary_email: body.primary_email ?? null,
    billing_contact: body.billing_contact ?? null,
    billing_phone_number: body.billing_phone_number ?? null,
    billing_email: body.billing_email ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
  });
  revalidatePath('/vendors');
  return NextResponse.json(row, { status: 201 });
}
