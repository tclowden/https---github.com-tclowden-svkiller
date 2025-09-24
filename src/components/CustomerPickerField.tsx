'use client';

import * as React from 'react';
import { CustomerSelect } from '@/components/CustomerSelect';

export function CustomerPickerField() {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-900">Customer</label>
      <CustomerSelect
        onChange={(id, display) => {
          // integrate with AddModal’s internal state
          (window as any).__addmodal_set?.((prev: any) => ({
            ...prev,
            customer_id: id ?? null,
            customer: display ?? null, // keep legacy string populated
          }));
        }}
        placeholder="Search customers…"
      />
    </div>
  );
}
