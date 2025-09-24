import { CustomFieldEditor } from '@/components/custom-fields/CustomFieldEditor';

export default function NewCustomFieldPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">New Custom Field</h2>
      <CustomFieldEditor mode="new" />
    </div>
  );
}
