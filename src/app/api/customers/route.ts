export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Op } from "sequelize";

export async function GET(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Customer = s.model("Customer") as any;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("query") ?? "").trim();

  let rows;
  if (q) {
    rows = await Customer.findAll({
      where: { company_name: { [Op.iLike]: `%${q}%` } }, // ⬅️ case-insensitive in Postgres
      order: [["company_name", "ASC"]],
      attributes: ["id", "company_name"],
      raw: true,
    });
  } else {
    rows = await Customer.findAll({
      order: [["company_name", "ASC"]],
      attributes: ["id", "company_name"],
      limit: 50,
      raw: true,
    });
  }

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Customer = s.model("Customer") as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await Customer.create({
    company_name: body.company_name ?? null,
    street_address: body.street_address ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    zip: body.zip ?? null,
    primary_contact: body.primary_contact ?? null,
    primary_phone_number: body.primary_phone_number ?? null,
    primary_email: body.primary_email ?? null,
    billing_contact: body.billing_contact ?? null,
    billing_phone_number: body.billing_phone_number ?? null,
    billing_email: body.billing_email ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
  });
  revalidatePath("/customers");
  return NextResponse.json(row, { status: 201 });
}
