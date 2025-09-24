'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type ProductRow = {
  id: string;
  name: string | null;
  unit_of_measure: string | null;
  cost_per_uom: string | null; // stored as string
  createdAt: string;
};

export default function ProductsTable({ data }: { data: ProductRow[] }) {
  const columns = React.useMemo<ColumnDef<ProductRow>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'unit_of_measure', header: 'UOM' },
    {
      accessorKey: 'cost_per_uom',
      header: 'Cost / UOM',
      cell: ({ getValue }) => {
        const v = getValue<string | null>();
        if (!v) return '';
        const n = Number(v);
        return isNaN(n) ? v : n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
      },
    },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<ProductRow>
      columns={columns}
      data={data}
      storageKey="table:products"
      initialHidden={['createdAt']}
    />
  );
}
