import Link from 'next/link';
import { ensureDb, getSequelize } from '@/lib/db';
import { notFound } from 'next/navigation';

type Params = { params: { id: string } };

export default async function UserDetailPage({ params }: Params) {
  await ensureDb();
  const s = getSequelize();
  const User = s.model('User') as any;

  const row = await User.findByPk(params.id, { raw: true });
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User</h2>
        <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">← Back to Users</Link>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-4">
        <Field label="ID" value={row.id} />
        <Field label="Email" value={row.email ?? ''} />
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
