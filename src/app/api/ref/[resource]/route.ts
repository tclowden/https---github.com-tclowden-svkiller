export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ensureDb, getSequelize } from "@/lib/db";
import { Op } from "sequelize";

// Allow-list config for referenced resources
const RESOURCES: Record<
  string,
  {
    model: string;
    label: string;
    value?: string;
    createMap?: (body: any) => any;
  }
> = {
  customers: {
    model: "Customer",
    label: "company_name",
    value: "id",
    createMap: (b) => ({
      company_name: String(b.company_name ?? b.label ?? b.q ?? "").trim(),
    }),
  },
  vendors: {
    model: "Vendor",
    label: "name",
    value: "id",
    createMap: (b) => ({ name: String(b.name ?? b.label ?? b.q ?? "").trim() }),
  },
  products: {
    model: "Product",
    label: "name",
    value: "id",
    createMap: (b) => ({ name: String(b.name ?? b.label ?? b.q ?? "").trim() }),
  },
  opportunities: { model: "Opportunity", label: "name", value: "id" },

  // add more as needed
};

export async function GET(
  req: Request,
  { params }: { params: { resource: string } }
) {
  const def = RESOURCES[params.resource];
  if (!def)
    return NextResponse.json(
      { error: "resource not allowed" },
      { status: 404 }
    );

  await ensureDb();
  const s = getSequelize();
  const M = s.model(def.model) as any;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  const where = q ? { [def.label]: { [Op.iLike]: `%${q}%` } } : undefined;

  const rows = await M.findAll({
    where,
    order: [[def.label, "ASC"]],
    attributes: [def.value ?? "id", def.label],
    limit: 50,
    raw: true,
  });

  // normalize to {id,label}
  const data = rows.map((r: any) => ({
    id: r[def.value ?? "id"],
    label: r[def.label],
  }));
  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: { resource: string } }
) {
  const def = RESOURCES[params.resource];
  if (!def || !def.createMap)
    return NextResponse.json({ error: "not allowed" }, { status: 404 });

  await ensureDb();
  const s = getSequelize();
  const M = s.model(def.model) as any;

  const body = await req.json().catch(() => ({}));
  const payload = def.createMap(body);

  const labelValue = payload?.[def.label];
  if (!labelValue)
    return NextResponse.json(
      { error: `${def.label} required` },
      { status: 400 }
    );

  const row = await M.create(payload);
  return NextResponse.json(
    { id: row[def.value ?? "id"], label: row[def.label] },
    { status: 201 }
  );
}
