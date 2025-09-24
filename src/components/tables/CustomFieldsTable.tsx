'use client';

import * as React from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type CustomFieldRow = {
  id: string;
  name: string | null;
  type: string | null;
  createdAt: string;
};

export default function CustomFieldsTable({ data }: { data: CustomFieldRow[] }) {
  const columns = React.useMemo<ColumnDef<CustomFieldRow>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link className="text-blue-600 hover:underline" href={`/admin/custom-fields/${row.original.id}`}>
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<CustomFieldRow>
      columns={columns}
      data={data}
      storageKey="table:admin:custom-fields"
      initialHidden={['createdAt']}
    />
  );
}
