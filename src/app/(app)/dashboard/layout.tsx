import { ensureDb, getSequelize } from '@/lib/db';

export default async function DashboardPage() {
  await ensureDb();
  const s = getSequelize();
  const User = s.model('User') as any;
  const Customer = s.model('Customer') as any;

  const [users, customers] = await Promise.all([User.count(), Customer.count()]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-2xl font-semibold">Welcome to the Dashboard</h2>
        <p className="text-gray-600 mt-2">We’ll add richer stats and widgets here soon.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Users" value={users} />
        <StatCard label="Customers" value={customers} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </div>
  );
}
