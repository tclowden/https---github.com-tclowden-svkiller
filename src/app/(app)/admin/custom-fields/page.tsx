import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import CustomFieldsTable, { type CustomFieldRow } from '@/components/tables/CustomFieldsTable';

export default async function AdminCustomFieldsPage() {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model('CustomField') as any;

  const rows = await CustomField.findAll({ order: [['createdAt', 'DESC']], raw: true });

  const data: CustomFieldRow[] = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Custom Fields</h2>
        <AddModal
          title="Add Custom Field"
          endpoint="/api/custom-fields"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'type', label: 'Type', required: true },
          ]}
        />
      </div>
      <CustomFieldsTable data={data} />
    </div>
  );
}
