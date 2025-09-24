'use client';

import * as React from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type TransactionTypeRow = {
  id: string;
  name: string | null;
  createdAt: string;
};

export default function TransactionTypesTable({ data }: { data: TransactionTypeRow[] }) {
  const columns = React.useMemo<ColumnDef<TransactionTypeRow>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link className="text-blue-600 hover:underline" href={`/admin/transaction-types/${row.original.id}`}>
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<TransactionTypeRow>
      columns={columns}
      data={data}
      storageKey="table:admin:transaction-types"
      initialHidden={['createdAt']}
    />
  );
}
