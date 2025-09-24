// src/app/(app)/opportunities/page.tsx
import { ensureDb, getSequelize } from '@/lib/db';
import OpportunitiesTable, { type OpportunityRow } from '@/components/tables/OpportunitiesTable';
import { AddModal } from '@/components/AddModal';

export default async function OpportunitiesPage() {
  await ensureDb();
  const s = getSequelize();
  const Opportunity = s.model('Opportunity') as any;
  const Customer = s.model('Customer') as any;

  const rows = await Opportunity.findAll({
    order: [['createdAt', 'DESC']],
    include: [{ model: Customer, attributes: ['company_name'], required: false }],
    raw: true,
    nest: true,
  });

  const data: OpportunityRow[] = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    customer: r.Customer?.company_name ?? r.customer ?? null,
    owner: r.owner,
    sales_rep: r.sales_rep,
    transaction_type: r.transaction_type,
    associated_custom_field_ids: r.associated_custom_field_ids,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Opportunities</h2>
        <AddModal
          title="Add Opportunity"
          endpoint="/api/opportunities"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'customer_id', label: 'Customer', type: 'reference', resource: 'customers', create: true },
            { name: 'owner', label: 'Owner' },
            { name: 'sales_rep', label: 'Sales Rep' },
            { name: 'transaction_type', label: 'Type' },
          ]}
        />
      </div>

      <OpportunitiesTable data={data} />
    </div>
  );
}
