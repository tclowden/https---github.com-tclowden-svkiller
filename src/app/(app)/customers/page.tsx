import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import CustomersTable, { type CustomerRow } from '@/components/tables/CustomersTable';

export default async function CustomersPage() {
  await ensureDb();
  const s = getSequelize();
  const Customer = s.model('Customer') as any;

  const rows = await Customer.findAll({ order: [['createdAt', 'DESC']], raw: true });

  const data: CustomerRow[] = rows.map((r: any) => ({
    id: r.id,
    company_name: r.company_name,
    city: r.city,
    state: r.state,
    primary_email: r.primary_email,
    primary_phone_number: r.primary_phone_number,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
        <AddModal
          title="Add Customer"
          endpoint="/api/customers"
          fields={[
            { name: 'company_name', label: 'Company', required: true },
            { name: 'city', label: 'City' },
            { name: 'state', label: 'State' },
            { name: 'primary_email', label: 'Email', type: 'email' },
            { name: 'primary_phone_number', label: 'Phone' },
          ]}
        />
      </div>

      <CustomersTable data={data} />
    </div>
  );
}
