'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type TaskRow = {
  id: string;
  name: string | null;
  owner: string | null;
  transaction_type: string | null;
  associated_custom_field_ids: string | null;
  createdAt: string;
};

export default function TasksTable({ data }: { data: TaskRow[] }) {
  const columns = React.useMemo<ColumnDef<TaskRow>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'owner', header: 'Owner' },
    { accessorKey: 'transaction_type', header: 'Type' },
    { accessorKey: 'associated_custom_field_ids', header: 'Custom Field IDs' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<TaskRow>
      columns={columns}
      data={data}
      storageKey="table:tasks"
      initialHidden={['associated_custom_field_ids','createdAt']}
    />
  );
}
