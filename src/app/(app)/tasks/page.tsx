import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import TasksTable, { type TaskRow } from '@/components/tables/TasksTable';

export default async function TasksPage() {
  await ensureDb();
  const s = getSequelize();
  const Task = s.model('Task') as any;

  const rows = await Task.findAll({ order: [['createdAt', 'DESC']], raw: true });
  const data: TaskRow[] = rows.map((r: any) => ({
    id: r.id, name: r.name, owner: r.owner, transaction_type: r.transaction_type,
    associated_custom_field_ids: r.associated_custom_field_ids,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <AddModal
          title="Add Task"
          endpoint="/api/tasks"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'owner', label: 'Owner' },
            { name: 'transaction_type', label: 'Type' },
          ]}
        />
      </div>
      <TasksTable data={data} />
    </div>
  );
}
