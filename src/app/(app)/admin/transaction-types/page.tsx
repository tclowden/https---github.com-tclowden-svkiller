import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import TransactionTypesTable, { type TransactionTypeRow } from '@/components/tables/TransactionTypesTable';

export default async function AdminTransactionTypesPage() {
  await ensureDb();
  const s = getSequelize();
  const TransactionType = s.model('TransactionType') as any;

  const rows = await TransactionType.findAll({ order: [['createdAt', 'DESC']], raw: true });

  const data: TransactionTypeRow[] = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Transaction Types</h2>
        <AddModal title="Add Transaction Type" endpoint="/api/transaction-types" fields={[{ name: 'name', label: 'Name', required: true }]} />
      </div>
      <TransactionTypesTable data={data} />
    </div>
  );
}
