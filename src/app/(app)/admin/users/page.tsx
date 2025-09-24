import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import UsersTable, { type UserRow } from '@/components/tables/UsersTable';

export default async function AdminUsersPage() {
  await ensureDb();
  const s = getSequelize();
  const User = s.model('User') as any;

  const rows = await User.findAll({ order: [['createdAt', 'DESC']], raw: true });

  const data: UserRow[] = rows.map((r: any) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <AddModal
          title="Add User"
          endpoint="/api/users"
          fields={[
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'name', label: 'Name' },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]}
        />
      </div>

      <UsersTable data={data} />
    </div>
  );
}
