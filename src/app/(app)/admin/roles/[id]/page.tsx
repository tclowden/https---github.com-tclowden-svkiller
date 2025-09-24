import Link from 'next/link';
import { ensureDb, getSequelize } from '@/lib/db';
import { notFound } from 'next/navigation';

type Params = { params: { id: string } };

export default async function RoleDetailPage({ params }: Params) {
  await ensureDb();
  const s = getSequelize();
  const Role = s.model('Role') as any;

  const row = await Role.findByPk(params.id, { raw: true });
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Role</h2>
        <Link href="/admin/roles" className="text-sm text-blue-600 hover:underline">← Back to Roles</Link>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-4">
        <Field label="ID" value={row.id} />
        <Field label="Name" value={row.name ?? ''} />
        <Field label="Created" value={new Date(row.createdAt).toLocaleString()} />
        <Field label="Updated" value={new Date(row.updatedAt).toLocaleString()} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="col-span-2 font-medium text-gray-900">{value}</div>
    </div>
  );
}
