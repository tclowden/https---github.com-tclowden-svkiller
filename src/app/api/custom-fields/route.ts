// src/app/api/custom-fields/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { revalidatePath } from "next/cache";

function getModelSafe<T = any>(name: string) {
  const s = getSequelize();
  try {
    return s.model(name) as unknown as T;
  } catch {
    return null;
  }
}

export async function GET() {
  await ensureDb();
  const CustomField = getModelSafe<any>("CustomField");
  const CustomFieldOption = getModelSafe<any>("CustomFieldOption");

  if (!CustomField) {
    return NextResponse.json(
      { error: "CustomField model not registered" },
      { status: 500 }
    );
  }

  // If options model is missing, return fields without options (avoids hard crash)
  if (!CustomFieldOption) {
    const rows = await CustomField.findAll({ order: [["createdAt", "DESC"]] });
    return NextResponse.json(rows);
  }

  const rows = await CustomField.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: CustomFieldOption,
        required: false,
        separate: true,
        order: [["sort_order", "ASC"]],
        attributes: ["id", "label", "value", "sort_order", "custom_field_id"],
      },
    ],
  });

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureDb();
  const CustomField = getModelSafe<any>("CustomField");
  if (!CustomField) {
    return NextResponse.json(
      { error: "CustomField model not registered" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({} as any));
  const { name, type, options, formula } = body || {};
  if (!name || !type) {
    return NextResponse.json(
      { error: "name and type required" },
      { status: 400 }
    );
  }

  const cfg = type === "formula" ? { expression: String(formula ?? "") } : null;
  const field = await CustomField.create({ name, type, config: cfg });

  if (type === "dropdown" && Array.isArray(options) && options.length > 0) {
    const CustomFieldOption = getModelSafe<any>("CustomFieldOption");
    if (!CustomFieldOption) {
      // Give a clear error instead of throwing
      return NextResponse.json(
        {
          error:
            "CustomFieldOption model not registered (export it and wire associations in db.ts)",
        },
        { status: 500 }
      );
    }

    const rows = options.map((o: any, i: number) => ({
      custom_field_id: field.id,
      label: String(o.label ?? o.value ?? ""),
      value: String(o.value ?? o.label ?? ""),
      sort_order: Number.isFinite(o.sort_order) ? o.sort_order : i,
    }));

    if (rows.length) {
      await CustomFieldOption.bulkCreate(rows);
    }
  }

  revalidatePath("/admin/custom-fields");
  return NextResponse.json(field, { status: 201 });
}
