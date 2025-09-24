export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model("CustomField") as any;
  const CustomFieldOption = s.model("CustomFieldOption") as any;

  const row = await CustomField.findByPk(params.id, {
    include: [
      {
        model: CustomFieldOption,
        required: false,
        separate: true,
        order: [["sort_order", "ASC"]],
      },
    ],
  });
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model("CustomField") as any;
  const body = await req.json().catch(() => ({} as any));

  const row = await CustomField.findByPk(params.id);
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });

  const updates: any = {};
  if ("name" in body) updates.name = body.name;
  if ("type" in body) updates.type = body.type;
  if ("formula" in body)
    updates.config = { ...(row.config ?? {}), expression: body.formula ?? "" };

  await row.update(updates);
  revalidatePath("/admin/custom-fields");
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model("CustomField") as any;

  const count = await CustomField.destroy({ where: { id: params.id } });
  if (!count) return NextResponse.json({ error: "not found" }, { status: 404 });
  revalidatePath("/admin/custom-fields");
  return NextResponse.json({ ok: true });
}
