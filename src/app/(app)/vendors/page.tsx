import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import VendorsTable, { type VendorRow } from '@/components/tables/VendorsTable';

export default async function VendorsPage() {
  await ensureDb();
  const s = getSequelize();
  const Vendor = s.model('Vendor') as any;

  const rows = await Vendor.findAll({ order: [['createdAt', 'DESC']], raw: true });

  const data: VendorRow[] = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    state: r.state,
    primary_email: r.primary_email,
    payment_terms: r.payment_terms,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Vendors</h2>
        <AddModal
          title="Add Vendor"
          endpoint="/api/vendors"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'city', label: 'City' },
            { name: 'state', label: 'State' },
            { name: 'primary_email', label: 'Email', type: 'email' },
            { name: 'payment_terms', label: 'Payment Terms' },
          ]}
        />
      </div>

      <VendorsTable data={data} />
    </div>
  );
}
