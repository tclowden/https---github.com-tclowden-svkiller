'use client';

import * as React from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type RoleRow = {
  id: string;
  name: string | null;
  createdAt: string;
};

export default function RolesTable({ data }: { data: RoleRow[] }) {
  const columns = React.useMemo<ColumnDef<RoleRow>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Role',
      cell: ({ row }) => (
        <Link className="text-blue-600 hover:underline" href={`/admin/roles/${row.original.id}`}>
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<RoleRow>
      columns={columns}
      data={data}
      storageKey="table:admin:roles"
      initialHidden={['createdAt']}
    />
  );
}
