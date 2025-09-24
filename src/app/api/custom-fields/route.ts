export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model("CustomField") as any;
  const CustomFieldOption = s.model("CustomFieldOption") as any;

  const rows = await CustomField.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: CustomFieldOption,
        required: false,
        separate: true,
        order: [["sort_order", "ASC"]],
      },
    ],
  });

  // return with options included
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model("CustomField") as any;
  const CustomFieldOption = s.model("CustomFieldOption") as any;

  const body = await req.json().catch(() => ({} as any));
  const { name, type, options, formula } = body || {};
  if (!name || !type)
    return NextResponse.json(
      { error: "name and type required" },
      { status: 400 }
    );

  const cfg = type === "formula" ? { expression: formula ?? "" } : null;
  const field = await CustomField.create({ name, type, config: cfg });

  if (type === "dropdown" && Array.isArray(options)) {
    const withOrder = options.map((o: any, i: number) => ({
      custom_field_id: field.id,
      label: String(o.label ?? o.value ?? ""),
      value: String(o.value ?? o.label ?? ""),
      sort_order: i,
    }));
    await CustomFieldOption.bulkCreate(withOrder);
  }

  revalidatePath("/admin/custom-fields");
  return NextResponse.json(field, { status: 201 });
}
