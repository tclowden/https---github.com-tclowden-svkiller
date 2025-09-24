import { ensureDb, getSequelize } from '@/lib/db';

export default async function Dashboard() {
  await ensureDb();
  const s = getSequelize();

  const User = s.model('User') as any;
  const Customer = s.model('Customer') as any;

  const [users, customers] = await Promise.all([
    User.count(),
    Customer.count(),
  ]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-3xl">{users}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-500">Customers</div>
          <div className="text-3xl">{customers}</div>
        </div>
      </div>
    </div>
  );
}
