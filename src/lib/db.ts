// src/lib/db.ts
import "dotenv/config";
import "reflect-metadata";
import pg from "pg";
import { Sequelize } from "sequelize-typescript";
import * as models from "@/models";

const modelClasses = Object.values(models) as any[];

let s: Sequelize | null = null;

function makeSequelize() {
  return new Sequelize(process.env.DATABASE_URL!, {
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    models: modelClasses,
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  });
}

function getModelSafe<T = any>(name: string): T | null {
  try {
    return (s as Sequelize).model(name) as unknown as T;
  } catch {
    return null;
  }
}

function linkOneToMany(
  parentName: string,
  childName: string,
  fk: string,
  onDelete?: "CASCADE" | "SET NULL"
) {
  const P = getModelSafe(parentName) as any;
  const C = getModelSafe(childName) as any;
  if (P && C) {
    P.hasMany(C, { foreignKey: fk, ...(onDelete ? { onDelete } : {}) });
    C.belongsTo(P, { foreignKey: fk });
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __sequelize__: Sequelize | undefined;
}

export function getSequelize() {
  s = global.__sequelize__ ?? (global.__sequelize__ = makeSequelize());

  if (!(s as any)._assocDone) {
    // Customers ↔ Transactions
    linkOneToMany("Customer", "Opportunity", "customer_id");
    linkOneToMany("Customer", "Quote", "customer_id");
    linkOneToMany("Customer", "SalesOrder", "customer_id");
    linkOneToMany("Customer", "Job", "customer_id");
    linkOneToMany("Opportunity", "Quote", "opportunity_id");

    // Custom Fields ↔ Options
    linkOneToMany(
      "CustomField",
      "CustomFieldOption",
      "custom_field_id",
      "CASCADE"
    );

    (s as any)._assocDone = true;
  }

  return s;
}

export async function ensureDb() {
  await getSequelize().authenticate();
}
