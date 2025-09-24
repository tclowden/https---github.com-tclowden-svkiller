'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type OpportunityRow = {
  id: string;
  name: string | null;
  customer: string | null;
  owner: string | null;
  sales_rep: string | null;
  transaction_type: string | null;
  associated_custom_field_ids: string | null;
  createdAt: string;
};

export default function OpportunitiesTable({ data }: { data: OpportunityRow[] }) {
  const columns = React.useMemo<ColumnDef<OpportunityRow>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'customer', header: 'Customer' },
    { accessorKey: 'owner', header: 'Owner' },
    { accessorKey: 'sales_rep', header: 'Sales Rep' },
    { accessorKey: 'transaction_type', header: 'Type' },
    { accessorKey: 'associated_custom_field_ids', header: 'Custom Field IDs' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<OpportunityRow>
      columns={columns}
      data={data}
      storageKey="table:opportunities"
      initialHidden={['associated_custom_field_ids','createdAt']}
    />
  );
}
