export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ensureDb();
  const s = getSequelize();
  const CustomFieldOption = s.model("CustomFieldOption") as any;

  const body = await req.json().catch(() => ({} as any));
  const { label, value } = body || {};
  if (!label || !value)
    return NextResponse.json(
      { error: "label and value required" },
      { status: 400 }
    );

  const max = await CustomFieldOption.max("sort_order", {
    where: { custom_field_id: params.id },
  });
  const sort_order = isFinite(max) ? Number(max) + 1 : 0;
  const opt = await CustomFieldOption.create({
    custom_field_id: params.id,
    label,
    value,
    sort_order,
  });

  revalidatePath("/admin/custom-fields");
  return NextResponse.json(opt, { status: 201 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Reorder payload: [{id, sort_order}, ...] or [{id, order}, ...]
  await ensureDb();
  const s = getSequelize();
  const CustomFieldOption = s.model("CustomFieldOption") as any;
  const body = await req.json().catch(() => [] as any[]);

  const t = await s.transaction();
  try {
    for (const item of body) {
      const order = item.sort_order ?? item.order;
      if (item.id != null && order != null) {
        await CustomFieldOption.update(
          { sort_order: Number(order) },
          { where: { id: item.id, custom_field_id: params.id }, transaction: t }
        );
      }
    }
    await t.commit();
  } catch (e) {
    await t.rollback();
    return NextResponse.json({ error: "reorder failed" }, { status: 400 });
  }

  revalidatePath("/admin/custom-fields");
  return NextResponse.json({ ok: true });
}
