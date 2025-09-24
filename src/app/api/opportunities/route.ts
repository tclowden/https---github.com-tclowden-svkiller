export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const Opportunity = s.model("Opportunity") as any;
  const rows = await Opportunity.findAll({
    order: [["createdAt", "DESC"]],
    raw: true,
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Opportunity = s.model("Opportunity") as any;
  const Customer = s.model("Customer") as any;

  const body = await req.json().catch(() => ({} as any));
  let customerName: string | null = body.customer ?? null;

  if (!customerName && body["customer_id__label"]) {
    customerName = body["customer_id__label"];
  }
  if (!customerName && body.customer_id) {
    const c = await Customer.findByPk(body.customer_id, {
      attributes: ["company_name"],
      raw: true,
    });
    if (c) customerName = c.company_name ?? null;
  }

  const row = await Opportunity.create({
    name: body.name ?? null,
    customer_id: body.customer_id ?? null,
    customer: customerName,
    owner: body.owner ?? null,
    sales_rep: body.sales_rep ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
    transaction_type: body.transaction_type ?? null,
  });

  return NextResponse.json(row, { status: 201 });
}
