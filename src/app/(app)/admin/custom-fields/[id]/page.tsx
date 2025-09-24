import Link from 'next/link';
import { ensureDb, getSequelize } from '@/lib/db';
import { notFound } from 'next/navigation';
import { DetailActions } from '@/components/DetailActions';

export default async function CustomFieldDetail({ params }: { params: { id: string } }) {
  await ensureDb();
  const s = getSequelize();
  const CustomField = s.model('CustomField') as any;

  const row = await CustomField.findByPk(params.id, { raw: true });
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Custom Field</h2>
        <Link href="/admin/custom-fields" className="text-sm text-blue-600 hover:underline">← Back</Link>
      </div>

      <DetailActions editHref={`/admin/custom-fields/${params.id}/edit`} />

      <div className="rounded-2xl border bg-white p-6 space-y-4">
        {/* your Field rows */}
      </div>
    </div>
  );
}
