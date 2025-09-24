export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await ensureDb();
  const s = getSequelize();
  const Customer = s.model("Customer") as any;
  const row = await Customer.findByPk(params.id, {
    attributes: ["id", "company_name"],
    raw: true,
  });
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(row);
}
