import { ensureDb, getSequelize } from '@/lib/db';
import { AddModal } from '@/components/AddModal';
import ProductsTable, { type ProductRow } from '@/components/tables/ProductsTable';

export default async function ProductsPage() {
  await ensureDb();
  const s = getSequelize();
  const Product = s.model('Product') as any;

  const rows = await Product.findAll({ order: [['createdAt', 'DESC']], raw: true });
  const data: ProductRow[] = rows.map((r: any) => ({
    id: r.id, name: r.name, unit_of_measure: r.unit_of_measure, cost_per_uom: r.cost_per_uom,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        <AddModal
          title="Add Product"
          endpoint="/api/products"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'unit_of_measure', label: 'UOM' },
            { name: 'cost_per_uom', label: 'Cost / UOM' },
          ]}
        />
      </div>
      <ProductsTable data={data} />
    </div>
  );
}
