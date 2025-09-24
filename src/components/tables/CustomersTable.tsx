'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type CustomerRow = {
  id: string;
  company_name: string | null;
  city: string | null;
  state: string | null;
  primary_email: string | null;
  primary_phone_number: string | null;
  createdAt: string;
};

export default function CustomersTable({ data }: { data: CustomerRow[] }) {
  const columns = React.useMemo<ColumnDef<CustomerRow>[]>(() => [
    { accessorKey: 'company_name', header: 'Company' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'primary_email', header: 'Email' },
    { accessorKey: 'primary_phone_number', header: 'Phone' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<CustomerRow>
      columns={columns}
      data={data}
      storageKey="table:customers"
      initialHidden={['createdAt']}
    />
  );
}
