'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type PurchaseOrderRow = {
  id: string;
  name: string | null;
  transaction_type: string | null;
  associated_custom_field_ids: string | null;
  createdAt: string;
};

export default function PurchaseOrdersTable({ data }: { data: PurchaseOrderRow[] }) {
  const columns = React.useMemo<ColumnDef<PurchaseOrderRow>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'transaction_type', header: 'Type' },
    { accessorKey: 'associated_custom_field_ids', header: 'Custom Field IDs' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<PurchaseOrderRow>
      columns={columns}
      data={data}
      storageKey="table:purchase-orders"
      initialHidden={['associated_custom_field_ids','createdAt']}
    />
  );
}
