'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type SalesOrderRow = {
  id: string;
  name: string | null;
  opportunity: string | null;
  customer: string | null;
  project_manager: string | null;
  sales_rep: string | null;
  transaction_type: string | null;
  associated_custom_field_ids: string | null;
  createdAt: string;
};

export default function SalesOrdersTable({ data }: { data: SalesOrderRow[] }) {
  const columns = React.useMemo<ColumnDef<SalesOrderRow>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'opportunity', header: 'Opportunity' },
    { accessorKey: 'customer', header: 'Customer' },
    { accessorKey: 'project_manager', header: 'PM' },
    { accessorKey: 'sales_rep', header: 'Sales Rep' },
    { accessorKey: 'transaction_type', header: 'Type' },
    { accessorKey: 'associated_custom_field_ids', header: 'Custom Field IDs' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<SalesOrderRow>
      columns={columns}
      data={data}
      storageKey="table:sales-orders"
      initialHidden={['associated_custom_field_ids','createdAt']}
    />
  );
}
