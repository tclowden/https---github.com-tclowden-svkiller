'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type QuoteRow = {
  id: string;
  name: string | null;
  opportunity: string | null;
  customer: string | null;
  sales_order: string | null;
  project_manager: string | null;
  sales_rep: string | null;
  transaction_type: string | null;
  associated_custom_field_ids: string | null;
  createdAt: string;
};

export default function QuotesTable({ data }: { data: QuoteRow[] }) {
  const columns = React.useMemo<ColumnDef<QuoteRow>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'opportunity', header: 'Opportunity' },
    { accessorKey: 'customer', header: 'Customer' },
    { accessorKey: 'sales_order', header: 'Sales Order' },
    { accessorKey: 'project_manager', header: 'PM' },
    { accessorKey: 'sales_rep', header: 'Sales Rep' },
    { accessorKey: 'transaction_type', header: 'Type' },
    { accessorKey: 'associated_custom_field_ids', header: 'Custom Field IDs' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<QuoteRow>
      columns={columns}
      data={data}
      storageKey="table:quotes"
      initialHidden={['associated_custom_field_ids','createdAt']}
    />
  );
}
