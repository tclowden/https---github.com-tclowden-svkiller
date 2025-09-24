'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type JobRow = {
  id: string;
  name: string | null;
  opportunity: string | null;
  customer: string | null;
  sales_order: string | null;
  project_manager: string | null;
  transaction_type: string | null;
  associated_custom_field_ids: string | null;
  createdAt: string;
};

export default function JobsTable({ data }: { data: JobRow[] }) {
  const columns = React.useMemo<ColumnDef<JobRow>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'opportunity', header: 'Opportunity' },
    { accessorKey: 'customer', header: 'Customer' },
    { accessorKey: 'sales_order', header: 'Sales Order' },
    { accessorKey: 'project_manager', header: 'PM' },
    { accessorKey: 'transaction_type', header: 'Type' },
    { accessorKey: 'associated_custom_field_ids', header: 'Custom Field IDs' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<JobRow>
      columns={columns}
      data={data}
      storageKey="table:jobs"
      initialHidden={['associated_custom_field_ids','createdAt']}
    />
  );
}
