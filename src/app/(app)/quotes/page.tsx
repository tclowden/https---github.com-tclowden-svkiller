import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import QuotesTable, { type QuoteRow } from '@/components/tables/QuotesTable';

export default async function QuotesPage() {
  await ensureDb();
  const s = getSequelize();
  const Quote       = s.model('Quote') as any;
  const Opportunity = s.model('Opportunity') as any;
  const Customer    = s.model('Customer') as any;

  const rows = await Quote.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      { model: Opportunity, attributes: ['name'], required: false },
      { model: Customer, attributes: ['company_name'], required: false },
    ],
    raw: true,
    nest: true,
  });

  const data: QuoteRow[] = rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    opportunity: r.Opportunity?.name ?? null,
    customer: r.Customer?.company_name ?? r.customer ?? null,
    project_manager: r.project_manager,
    sales_rep: r.sales_rep,
    transaction_type: r.transaction_type,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quotes</h2>
        <AddModal
          title="Add Quote"
          endpoint="/api/quotes"
          fields={[
            { name: 'name', label: 'Name', required: true },
            // 👇 pick from existing Opportunities (comes from /api/ref/opportunities)
            { name: 'opportunity_id', label: 'Opportunity', type: 'reference', resource: 'opportunities' },
            { name: 'project_manager', label: 'Project Manager' },
            { name: 'sales_rep', label: 'Sales Rep' },
            { name: 'transaction_type', label: 'Type' },
          ]}
        />
      </div>

      <QuotesTable data={data} />
    </div>
  );
}
