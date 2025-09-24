// src/app/api/custom-fields/[id]/options/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // 👈 Next 15: params is a Promise
) {
  const { id } = await ctx.params; // 👈 await it

  await ensureDb();
  const s = getSequelize();
  const CustomFieldOption = s.model("CustomFieldOption") as any;

  const body = await req.json().catch(() => ({} as any));
  const opts = Array.isArray(body?.options) ? body.options : [];
  if (!opts.length) {
    return NextResponse.json({ error: "options required" }, { status: 400 });
  }

  const rows = opts.map((o: any, i: number) => ({
    custom_field_id: id,
    label: String(o.label ?? o.value ?? ""),
    value: String(o.value ?? o.label ?? ""),
    sort_order: Number.isFinite(o.sort_order) ? o.sort_order : i,
  }));

  await CustomFieldOption.bulkCreate(rows);
  return NextResponse.json({ ok: true });
}
