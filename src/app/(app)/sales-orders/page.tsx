import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import SalesOrdersTable, { type SalesOrderRow } from '@/components/tables/SalesOrdersTable';

export default async function SalesOrdersPage() {
  await ensureDb();
  const s = getSequelize();
  const SalesOrder = s.model('SalesOrder') as any;

  const rows = await SalesOrder.findAll({ order: [['createdAt', 'DESC']], raw: true });
  const data: SalesOrderRow[] = rows.map((r: any) => ({
    id: r.id, name: r.name, opportunity: r.opportunity, customer: r.customer, project_manager: r.project_manager,
    sales_rep: r.sales_rep, transaction_type: r.transaction_type, associated_custom_field_ids: r.associated_custom_field_ids,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sales Orders</h2>
        <AddModal
          title="Add Sales Order"
          endpoint="/api/sales-orders"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'opportunity', label: 'Opportunity' },
            { name: 'customer', label: 'Customer' },
            { name: 'project_manager', label: 'PM' },
            { name: 'sales_rep', label: 'Sales Rep' },
            { name: 'transaction_type', label: 'Type' },
          ]}
        />
      </div>
      <SalesOrdersTable data={data} />
    </div>
  );
}
