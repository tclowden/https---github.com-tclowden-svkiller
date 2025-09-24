export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; optionId: string } }
) {
  await ensureDb();
  const s = getSequelize();
  const CustomFieldOption = s.model("CustomFieldOption") as any;

  const n = await CustomFieldOption.destroy({
    where: { id: params.optionId, custom_field_id: params.id },
  });
  if (!n) return NextResponse.json({ error: "not found" }, { status: 404 });

  revalidatePath("/admin/custom-fields");
  return NextResponse.json({ ok: true });
}
