// src/app/api/custom-fields/[id]/options/[optionId]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string; optionId: string }> } // 👈 Next 15: params is a Promise
) {
  const { id, optionId } = await ctx.params; // 👈 await it

  await ensureDb();
  const s = getSequelize();
  const CustomFieldOption = s.model("CustomFieldOption") as any;

  const opt = await CustomFieldOption.findOne({
    where: { id: optionId, custom_field_id: id },
  });

  if (!opt) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await opt.destroy();
  return NextResponse.json({ ok: true });
}
