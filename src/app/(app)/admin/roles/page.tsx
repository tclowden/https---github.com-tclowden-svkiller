import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import RolesTable, { type RoleRow } from '@/components/tables/RolesTable';

export default async function AdminRolesPage() {
  await ensureDb();
  const s = getSequelize();
  const Role = s.model('Role') as any;

  const rows = await Role.findAll({ order: [['createdAt', 'DESC']], raw: true });

  const data: RoleRow[] = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Roles</h2>
        <AddModal title="Add Role" endpoint="/api/roles" fields={[{ name: 'name', label: 'Name', required: true }]} />
      </div>
      <RolesTable data={data} />
    </div>
  );
}
