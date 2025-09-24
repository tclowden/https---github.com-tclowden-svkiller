'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export type VendorRow = {
  id: string;
  name: string | null;
  city: string | null;
  state: string | null;
  primary_email: string | null;
  payment_terms: string | null;
  createdAt: string;
};

export default function VendorsTable({ data }: { data: VendorRow[] }) {
  const columns = React.useMemo<ColumnDef<VendorRow>[]>(() => [
    { accessorKey: 'name', header: 'Vendor' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'primary_email', header: 'Email' },
    { accessorKey: 'payment_terms', header: 'Terms' },
    { accessorKey: 'createdAt', header: 'Created' },
  ], []);

  return (
    <DataTable<VendorRow>
      columns={columns}
      data={data}
      storageKey="table:vendors"
      initialHidden={['createdAt']}
    />
  );
}
