export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const Quote = s.model("Quote") as any;
  const rows = await Quote.findAll({
    order: [["createdAt", "DESC"]],
    raw: true,
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const Quote = s.model("Quote") as any;
  const Opportunity = s.model("Opportunity") as any;
  const Customer = s.model("Customer") as any;

  const body = await req.json().catch(() => ({} as any));

  // If an opportunity is selected, derive customer from it.
  let customer_id: string | null = body.customer_id ?? null;
  let customerName: string | null = body.customer ?? null;

  if (body.opportunity_id) {
    const opp = await Opportunity.findByPk(body.opportunity_id, {
      attributes: ["id", "customer_id"],
      raw: true,
    });

    if (opp?.customer_id) {
      customer_id = opp.customer_id;

      // Optional: also keep the legacy display string `customer`
      if (!customerName) {
        const c = await Customer.findByPk(opp.customer_id, {
          attributes: ["company_name"],
          raw: true,
        });
        customerName = c?.company_name ?? null;
      }
    }
  }

  const row = await Quote.create({
    name: body.name ?? null,
    opportunity_id: body.opportunity_id ?? null,
    customer_id,
    customer: customerName,
    project_manager: body.project_manager ?? null,
    sales_rep: body.sales_rep ?? null,
    associated_custom_field_ids: body.associated_custom_field_ids ?? null,
    transaction_type: body.transaction_type ?? null,
  });

  return NextResponse.json(row, { status: 201 });
}
