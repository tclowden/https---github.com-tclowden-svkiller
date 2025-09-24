'use client';

import * as React from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  createdAt: string;
};

export default function UsersTable({ data }: { data: UserRow[] }) {
  const columns = React.useMemo<ColumnDef<UserRow>[]>(() => [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <Link className="text-blue-600 hover:underline" href={`/admin/users/${row.original.id}`}>
          {row.original.email}
        </Link>
      ),
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<UserRow>
      columns={columns}
      data={data}
      storageKey="table:admin:users"
      initialHidden={['createdAt']}
    />
  );
}
