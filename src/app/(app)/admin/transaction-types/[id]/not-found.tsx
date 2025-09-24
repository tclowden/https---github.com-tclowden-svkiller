export default function NotFound() {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-semibold">Transaction Type not found</h2>
      <p className="text-gray-600 mt-1">The requested transaction type does not exist.</p>
    </div>
  );
}
