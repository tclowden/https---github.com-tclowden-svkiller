import { ensureDb, getSequelize } from '@/lib/db';
import { CustomFieldEditor } from '@/components/custom-fields/CustomFieldEditor';
import { notFound } from 'next/navigation';

export default async function EditCustomFieldPage({ params }: { params: { id: string } }) {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model('CustomField') as any;
  const CustomFieldOption = s.model('CustomFieldOption') as any;

  const row = await CustomField.findByPk(params.id, {
    raw: true,
    nest: true,
    include: [{ model: CustomFieldOption, required: false }],
  });
  if (!row) notFound();

  const initial = {
    name: row.name as string,
    type: row.type as string,
    formula: row?.config?.expression ?? '',
    options: (await CustomFieldOption.findAll({
      where: { custom_field_id: params.id },
      order: [['sort_order', 'ASC']],
      raw: true,
    })).map((o: any) => ({ id: o.id, label: o.label, value: o.value })),
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Edit Custom Field</h2>
      <CustomFieldEditor mode="edit" fieldId={params.id} initial={initial} />
    </div>
  );
}
