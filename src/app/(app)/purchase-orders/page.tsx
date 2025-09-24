import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import PurchaseOrdersTable, { type PurchaseOrderRow } from '@/components/tables/PurchaseOrdersTable';

export default async function PurchaseOrdersPage() {
  await ensureDb();
  const s = getSequelize();
  const PurchaseOrder = s.model('PurchaseOrder') as any;

  const rows = await PurchaseOrder.findAll({ order: [['createdAt', 'DESC']], raw: true });
  const data: PurchaseOrderRow[] = rows.map((r: any) => ({
    id: r.id, name: r.name, transaction_type: r.transaction_type,
    associated_custom_field_ids: r.associated_custom_field_ids,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
        <AddModal
          title="Add Purchase Order"
          endpoint="/api/purchase-orders"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'transaction_type', label: 'Type' },
          ]}
        />
      </div>
      <PurchaseOrdersTable data={data} />
    </div>
  );
}
