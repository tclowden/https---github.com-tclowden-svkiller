import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import JobsTable, { type JobRow } from '@/components/tables/JobsTable';

export default async function JobsPage() {
  await ensureDb();
  const s = getSequelize();
  const Job = s.model('Job') as any;

  const rows = await Job.findAll({ order: [['createdAt', 'DESC']], raw: true });
  const data: JobRow[] = rows.map((r: any) => ({
    id: r.id, name: r.name, opportunity: r.opportunity, customer: r.customer, sales_order: r.sales_order,
    project_manager: r.project_manager, transaction_type: r.transaction_type, associated_custom_field_ids: r.associated_custom_field_ids,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Jobs</h2>
        <AddModal
          title="Add Job"
          endpoint="/api/jobs"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'opportunity', label: 'Opportunity' },
            { name: 'customer', label: 'Customer' },
            { name: 'sales_order', label: 'Sales Order' },
            { name: 'project_manager', label: 'PM' },
            { name: 'transaction_type', label: 'Type' },
          ]}
        />
      </div>
      <JobsTable data={data} />
    </div>
  );
}
